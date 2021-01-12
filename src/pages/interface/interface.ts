export interface UserData {
    name: string;
    email: string;
    emailSecond: string;
    maskedCpf: string;
    address: string;
    zipCode: string;
    uf: IUF;
    city: string;
    district: string;
    complement: string;
    phone: string;
    cellphone: string;
    phoneWork: string;
  }

  export interface IUF {
    value: string;
    label: string;
    id: string;
  }

  export interface Address {
    street: string;
    zipCode: string;
    uf: string;
    city: string;
    district: string;
    complement: string;
  }
  
  export interface Phone {
    ddd: string;
    number: string;
    phoneType: number;
  }
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
  