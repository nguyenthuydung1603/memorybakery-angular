

export interface IProductVariant {
  Size: string;
  UnitPrice: string;
  PromotionPrice: string;
  Quantity: number;
}
 export interface IProduct {
  id:number ;
  Name: string;
  Variant: IProductVariant[];
  Description: string;
  Img: string[];
  Category: string;
}
export class Product{
  constructor(
    public _id=null,
   public id: number=0,
   public Name: string="",
   public Variant: IProductVariant[],
   public Img: string[],
   public Category: string="",
  ){}
 }
 export class ProductVariant{
  constructor(
    public Size: string="",
    public UnitPrice: string="",
    public PromotionPrice: string="",
    public Quantity: number=0,
   ){}
 }
