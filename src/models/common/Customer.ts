import {CustomerEnum} from "@src/models/common/CustomerEnum.ts";
import {CustomerCategory} from "@src/models/common/CustomerCategory.ts";

export default interface Customer {
  id: number;
  name: string;
  address: string;
  memo: string;
  floor: string;
  category: number;
  categoryJoin?: CustomerCategory;
}

export const defaultCustomer: Customer = {
  id: 0,
  name: '',
  address: '',
  memo: '',
  floor: '',
  category: CustomerEnum.InstantPayment,
}