export default interface Customer {
  id: number;
  name: string;
  address: string;
  memo: string;
  floor: string;
}

export const defaultCustomer: Customer = {
  id: 0,
  name: '',
  address: '',
  memo: '',
  floor: '',
}