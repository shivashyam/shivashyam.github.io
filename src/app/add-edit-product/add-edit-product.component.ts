import { Product } from 'src/app/model/product';
import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../model/category';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  @Input() product: Product;
  @Input() categories: Category[];

  constructor() { }

  ngOnInit(): void {
    console.log(this.product);
  }

}
