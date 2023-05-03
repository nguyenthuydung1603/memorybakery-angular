export interface IPromotion {
    _id: any,
    Code:string;
    Name: string,
    Discount: string,
    Quantity: string,
    Condition: string,
    CreatedDate:string,
    StartDate: string,
    ExpireDate: string
  }
  
  export class Promotion{
    constructor(
        public _id:any=null,
        public Code: string ="",
        public Name: string ="",
        public Discount: string ="",
        public Quantity: string ="",
        public Condition: string ="",
        public CreatedDate: string ="",
        public StartDate: string ="",
        public ExpireDate: string =""
    ) { }
  }
