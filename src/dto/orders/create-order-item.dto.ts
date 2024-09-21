export interface CreateOrderItemDto {
  productVariantId: number;
  quantity: number;
  unitPrice: number;
  cartItemId: number;
}
