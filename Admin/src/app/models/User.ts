export interface IUser {
  _id: any,
  FullName: string,
  Gender: string,
  DateOfBirth: any,
  Phone: any,
  Image: any,
  UserName: string,
  Password: string,
  salt: string,
  CreateDate: any,
  UserType: IUserType,
  Cart: Array<ICart>,
  Order: Array<any>,
  Product: Array<any>,
  Address: Array<any>,
  Voucher: Array<any>
}

export interface IUserType {
  TypeName: string,
  Role: Array<IRole>
}

export interface IRole {
  RoleName: string
}

export interface ICart {
  ProductID: any,
  Size: any,
  Quantity: any
}

export class User {
  constructor(public _id: any = '',
      public FullName: string = '',
      public Gender: string = '',
      public DateOfBirth: any = '',
      public Phone: any = '',
      public Image: any = '',
      public UserName: string = '',
      public Password: string = '',
      public salt: string = '',
      public CreateDate: any = '',
      public UserType: any = {},
      public Cart: any = [],
      public Order: any = [],
      public Product: any = [],
      public Address: any = [],
      public Voucher: any = []) { }
}
