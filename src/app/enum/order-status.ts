export enum OrderStatus {
  USER_CANCELLED,
  BUSINESS_CANCELLED,
  PENDING, //customer book - not confirmed by business
  CONFIRMED, //customer book - confirmed by business
  DELIVERED, //out of warehouse - outflow / to -ou = remaining
  RETURNED //returned back
}
