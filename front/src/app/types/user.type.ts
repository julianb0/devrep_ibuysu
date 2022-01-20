import {AddressType} from "./address.type";

export type UserType = {
  id: number,
  firstname: string,
  lastname: string,
  address: AddressType,
  phone: string,
  email: string,
  password: string,
  apikey?: string
}
