import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Product } from '../models/Product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  @ViewChild('quantityInput') quantityInput!: ElementRef;
  value=1
  price:any
  data:any=[]
  listInCart: any = []
  subTotal!: number;
  ngOnInit() {
    this.listInCart = localStorage.getItem('cart')
    this.data = JSON.parse(this.listInCart)
  }
  onChange(value: number) {
    this.value = isNaN(value) ? 1 : value;
  }
  increaseValue() {
    let value = parseInt(this.quantityInput.nativeElement.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    this.value = value < 1 ? 0 : value;
  }

  decreaseValue() {
    let value = parseInt(this.quantityInput.nativeElement.value, 10);
    value = isNaN(value) ? 0 : value;
    value--;
    this.value = value < 2 ? 2 : value;
  }
  updateQty(item: any) {
    if(item.qty < 1 || item.qty > 99) return alert('Phải nhập số lượng lớn hơn 0 và bé hơn 100')
    this.data.map((i: any) => {
      if (i._id == item._id) i.qty = item.qty
      return
    })

    localStorage.setItem('cart', JSON.stringify(this.data))
  }
    changeState() {
    const val = (<HTMLInputElement>document.getElementById('input-voucher')).value;
    if (val.length > 0) {
      (<HTMLInputElement>document.getElementById('apply')).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById('apply')).disabled = true;
    }
  }

  removeItem(p: any) {
    if (confirm("Bạn có chắc chắn xóa?")==true){
    let cart: any = localStorage.getItem('cart')
    if (cart) {
      this.data = JSON.parse(cart)
      this.data = this.data.filter((pro: any) => pro._id != p._id)
    }
    localStorage.setItem('cart', JSON.stringify(this.data))
  }
  }
  calculateTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.data) {
      totalPrice += item.Variant[0].PromotionPrice * item.qty;
    }
    return totalPrice;
  }

}
