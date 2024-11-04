export interface CreateOrderItemDto {
  productVariantId: number | string;
  quantity: number;
  unitPrice: number;
  cartItemId: number | string | null;
}
