import {CustomerEnum} from "@src/models/common/CustomerEnum.ts";
import {CustomerCategory} from "@src/models/common/CustomerCategory.ts";
import {CustomerPrice} from "@src/models/manager/CustomerPrice.ts";

export default interface Customer {
  id: number;
  name: string;
  address: string;
  memo: string;
  floor: string;
  category: number;
  categoryJoin?: CustomerCategory;
  customerPriceJoin: CustomerPrice[];
  withdrawn: number;
  showPrice: number;
  hideOrderStatus: number;
  showConfirm: number;
}

export const defaultCustomer: Customer = {
  id: 0,
  name: '',
  address: '',
  memo: '',
  floor: '',
  category: CustomerEnum.InstantPayment,
  customerPriceJoin: [],
  withdrawn: 0,
  showPrice: 0,
  hideOrderStatus: 0,
  showConfirm: 0,
}