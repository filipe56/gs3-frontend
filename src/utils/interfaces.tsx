export interface UserData {
  name: string;
  email: string;
  maskedCpf: string;
  ddd: string;
  number: string;
  phoneTypeString: string;
  street: string;
  maskedZip: string;
  uf: string;
  city: string;
  district: string;
  complement: string;
}
export interface Address {
  street: string;
  zipCode: string;
  uf: string;
  city: string;
  district: string;
  complement: string;
  id?: number;
}

export interface Phone {
  ddd: string;
  number: string;
  phoneType: number;
}

export interface PhoneEdit {
  ddd: string;
  number: string;
  phoneType: string;
  id: number;
}
export type PhoneItemsEdit = Array<PhoneEdit>;

export type PhoneItems = Array<Phone>;

export type EmailItems = Array<string>;

export interface RequestData {
  id: number;
  name: string;
  emails: EmailItems;
  cpf: string;
  address: Address;
  phones: PhoneItems;
}
