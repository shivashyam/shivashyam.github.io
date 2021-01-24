import { ShoppingCart } from '../../model/shopping-cart';
import { CartService } from './../../service/cart.service';
import { CategoryService } from './../../service/category.service';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { Options } from '@angular-slider/ngx-slider';
import { Category } from 'src/app/model/category';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  public products: Product[];
  public pageProducts: Product[];
  public allProducts: Product[];
  public categories: Category[];
  searchInputValue: string;
  userPriceInput: string;
  newValueSelected: boolean = false;
  featuredValueSelected: boolean = false;
  onSaleValueSelected: boolean = false;
  noProducts: boolean = false;
  categoryClicked: string = '';
  newCount = 0;
  tabIndex = 0;
  featuredCount = 0;
  onSaleCount = 0;
  user: User;
  product: Product;
  selectedProduct: Product;
  editProduct: Product;
  p: any;


  userPriceValue: number = 0;
  userPriceHighValue: number = 200;
  businessPricevalue: number = 0;
  businessPriceHighvalue: number = 200;
  userPriceOptions: Options = {
    floor: 0,
    ceil: 200
  };
  businessPriceOptions: Options = {
    floor: 0,
    ceil: 200
  };
  pagesList = [];
  currentPageNumber = 1;
  pageSize = 9;
  showAddEditDialog = false;
  constructor(private authenticationService: AuthenticationService, private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private cartService :CartService
    ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getProducts(true);
  }


  public getProducts(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.productService.getProducts().subscribe(
        (response: Product[]) => {
          this.products = response;
          this.allProducts = response;
          this.calculateCountOfFilters();
          this.setMinAndMaxProductPrices();
          // this.getPageCountAndList();
          this.getCategories();
          console.log(this.businessPriceOptions);
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} product(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  getPageCountAndList() {
    this.currentPageNumber = 1;
    if (this.products && this.products.length > 0) {
      const pagecount = this.products.length / this.pageSize;
      const roundedpageCount = Math.ceil(pagecount);
      this.getArrayofPageNumbers(roundedpageCount);
    } else {
      this.getArrayofPageNumbers(1);
    }
    this.getSelectedPageProducts(this.currentPageNumber);
  }

  getSelectedPageProducts(pageNumber) {
    let startOfIndex = (pageNumber - 1) * this.pageSize;
    this.pageProducts = [];
    for (startOfIndex;startOfIndex < pageNumber * this.pageSize; startOfIndex++) {
      this.pageProducts.push(this.products[startOfIndex]);
    }
  }

  getArrayofPageNumbers(roundedpageCount) {
    this.pagesList = [];
    for (let i = 1; i <= roundedpageCount; i++) {
      this.pagesList.push(i);
    }
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  public searchProducts(): void {
    console.log(this.newValueSelected);
    let results: Product[] = [];
    if (!this.searchInputValue || this.searchInputValue.trim() === '') {
      this.searchInputValue = undefined;
    }
    for (const product of this.allProducts) {
      if (
        (!this.searchInputValue ||
          (this.searchInputValue.trim() !== '' &&
            (product.productName.toLowerCase().indexOf(this.searchInputValue.trim().toLowerCase()) !== -1 ||
              product.description.toLowerCase().indexOf(this.searchInputValue.trim().toLowerCase()) !== -1)))
        && (!(this.newValueSelected || this.featuredValueSelected || this.onSaleValueSelected)
          || ((!this.newValueSelected || product.isNew)
            && (!this.featuredValueSelected || product.isFeatured)
            && (!this.onSaleValueSelected || ((product.discount && (product.discount !== null || product.discount !== 0)) ||
              (product.discountPercentage && (product.discountPercentage !== null || product.discountPercentage !== 0))))))
        && (this.businessPricevalue <= product.businessPrice && this.businessPriceHighvalue >= product.businessPrice)
        && (this.userPriceValue <= product.userPrice && this.userPriceHighValue >= product.userPrice)
      ) {
        results.push(product);

      }
    }
    this.products = results;
    this.noProducts = false;
    if (results.length === 0) {
      this.noProducts = true;
    }
    this.calculateCountOfFilters();
    // this.getPageCountAndList();
  }

  setMinAndMaxProductPrices() {
    const businessPrices = this.products.map(a => a.businessPrice);
    const userPrices = this.products.map(a => a.userPrice);
    this.businessPricevalue = Math.floor(Math.min(...businessPrices));
    this.businessPriceHighvalue = Math.ceil(Math.max(...businessPrices));
    const bpOptions: Options = Object.assign({}, this.businessPriceOptions);
    bpOptions.floor = this.businessPricevalue;
    bpOptions.ceil = this.businessPriceHighvalue;
    this.businessPriceOptions = bpOptions;

    this.userPriceValue = Math.floor(Math.min(...userPrices));
    this.userPriceHighValue = Math.ceil(Math.max(...userPrices));
    const upOptions: Options = Object.assign({}, this.businessPriceOptions);

    upOptions.floor = this.userPriceValue;
    upOptions.ceil = this.userPriceHighValue;
    this.userPriceOptions = upOptions;
  }
  calculateCountOfFilters() {
    this.newCount = this.products.filter(x => x.isNew === true).length;
    this.featuredCount = this.products.filter(x => x.isFeatured === true).length;
    this.onSaleCount = this.products.filter(x => (x.discount && (x.discount !== null || x.discount !== 0)) ||
      (x.discountPercentage && (x.discountPercentage !== null || x.discountPercentage !== 0))).length;
  }

  
  selectCategory(categoryId: number, showNotification: boolean) {
    this.tabIndex = categoryId;
    if(categoryId !== 0){
    this.productService.getProductsByCategory(categoryId).subscribe(
      (response: Product[]) => {
        this.products = response;
          this.allProducts = response;
          this.calculateCountOfFilters();
          this.setMinAndMaxProductPrices();
          // this.getPageCountAndList();
          this.getCategories();
          console.log(this.businessPriceOptions);
          this.refreshing = false;
        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} product(s) loaded successfully.`);
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshing = false;
      }
    );

  }else{
    this.getProducts(true);
  }
}

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (response: Category[]) => {
        this.categories = response;
        this.refreshing = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.refreshing = false;
      }
    );
  }

  onAddToCartClick(selectedProduct: Product){
    const userId = this.user.userId;
    console.log(selectedProduct.productId);

    this.subscriptions.push(
      this.cartService.addToCart(selectedProduct, userId).subscribe(
        (response: any) => {
          // this.showLoading = false;
          console.log(response);  
          this.sendNotification(NotificationType.SUCCESS, response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          // this.showLoading = false;
        }
      )
    );
  }

  onDeleteProduct(id: number){
    this.subscriptions.push(
      this.productService.deleteProduct(id).subscribe(
        (response: any) => {
          // this.showLoading = false;
          console.log(response);  
          this.sendNotification(NotificationType.SUCCESS, response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          // this.showLoading = false;
        }
      )
    );
  }

  

  public onSelectProduct(selectedProduct: Product): void {
    this.selectedProduct = selectedProduct;
    this.clickButton('openProductDetail');
  }

  public onEditProduct(editProduct: Product): void {
    this.editProduct = editProduct;
    this.showAddEditDialog = true;
    this.categories;
    this.clickButton('openEditProduct');
  }

  public onAddProduct(): void {
    this.editProduct = new Product();
    this.showAddEditDialog = true;
    // this.selectedProduct = selectedProduct;
    this.clickButton('openAddProduct');
  }


  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
