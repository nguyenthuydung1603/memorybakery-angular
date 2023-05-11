export interface IVoucher {
  _id:any
  Code:string
  Name:string
  Discount:string
  Quantity:string
  Condition:string
  CreatedDate:Date;
  StartDate:string
  ExpireDate:string
}
export class Voucher {
  _id:any=null
  Code:string=""
  Name:string=""
  Discount:string=""
  Quantity:string=""
  Condition:string=""
  CreatedDate:Date=new Date()
  StartDate:string=""
  ExpireDate:string=""
}
