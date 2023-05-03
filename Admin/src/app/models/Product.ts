export interface IProduct {
  _id: string,
  Name: string,
  Variant: Array<IVariant>,
  Description: string,
  Img: Array<string>,
  Category: string
}

export interface IVariant {
  Size: string,
  UnitPrice: any,
  PromotionPrice: any,
  Quantity: number
}

export class Product {
  constructor(
      public _id: string = '',
      public Name: string = '',
      public Variant: any = [],
      public Description: string = '',
      public Img: any = [],
      public Category: string = ''
  ) { }
}

export class Variant {
  constructor(
      public Size: string = '',
      public UnitPrice: any = '',
      public PromotionPrice: any = '',
      public Quantity: number = 1
  ) { }
}
