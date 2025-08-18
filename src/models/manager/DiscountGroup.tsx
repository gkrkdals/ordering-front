export interface DiscountGroup {
  id: number;
  name: string;
  discountType: 'amount' | 'percent';
  discountValue: number;
  description: string;
}

export interface DiscountGroupExt extends DiscountGroup {
  modified: boolean;
  deleted: boolean;
}