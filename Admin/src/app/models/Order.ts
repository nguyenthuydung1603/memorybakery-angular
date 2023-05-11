export interface IOrder {
  _id: string;
  OrderID: number;
  OrderDate: string;
  DeliveryTime: string;
  CancelTime: string;
  OrderStatus: string;
  CostShip: string;
  PaymentMethod: any;
  Details: Array<IOrderDetails>;
  SubTotal: string;
  Note: string;
  Reason: string;
}
export interface IOrderDetails {
  OrderDetailID: number,
  ProductID: number,
  ProductName: string,
  Size: string,
  UnitPrice: string,
  Quantity: number,
  LineTotal: string
}

export class Order {
  constructor(
    public _id: string = '',
    public OrderID: number = 0,
    public OrderDate: string = '',
    public DeliveryTime: string = '',
    public CancelTime: string = '',
    public OrderStatus: string = '',
    public CostShip: string = '',
    public Details: any = [],
    public SubTotal: string = '',
    public Note: string = '',
    public Reason: string = ''
  ) { }
}
