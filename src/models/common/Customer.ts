import {CustomerEnum} from "@src/models/common/CustomerEnum.ts";
import {CustomerCategory} from "@src/models/common/CustomerCategory.ts";
import {CustomerMenuCategory} from "@src/models/manager/CustomerMenuCategory.ts";

export default interface Customer {
  id: number;
  name: string;
  address: string;
  memo: string;
  floor: string;
  category: number;
  categoryJoin?: CustomerCategory;
  customerPriceJoin: CustomerMenuCategory[];
}

export const defaultCustomer: Customer = {
  id: 0,
  name: '',
  address: '',
  memo: '',
  floor: '',
  category: CustomerEnum.InstantPayment,
  customerPriceJoin: []
}