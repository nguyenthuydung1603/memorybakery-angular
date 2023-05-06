import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit
 {
 modal: any
 modal2: any
 modal3: any
 modal4: any
 shippingFeeValue:any
 data:any=[]
 listInCart: any = []
  constructor() {}
  convertVND(price: any) {
    return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }
  ngOnInit() {
    this.modal = document.querySelector(".modal");
    this.modal2 = document.querySelector(".modal2");
    this.modal3 = document.querySelector(".modal3");
    this.modal4 = document.querySelector(".modal4");
    this.listInCart = localStorage.getItem('cart')
    this.data = JSON.parse(this.listInCart)
    const shippingFeeElement = document.getElementById("shipping-fee")!;
    const checkoutElement = document.getElementById("title-checkout")!;
    const dobMethodElement = document.getElementById("DOB-method")! as HTMLInputElement;;
    const storeMethodElement = document.getElementById("store-method")! as HTMLInputElement;
    const visaMethodElement = document.getElementById("visa-method")! as HTMLInputElement;
    const momoMethodElement = document.getElementById("momo-method")! as HTMLInputElement;
    const updateShippingFee = () : void=>{
      if (dobMethodElement.checked) {
        this.convertVND(shippingFeeElement.innerText = "20000");
      } else if (storeMethodElement.checked) {
        this.convertVND(shippingFeeElement.innerText = "0");
      }
      this.shippingFeeValue = parseInt(shippingFeeElement.innerText);
    }
    const updateCheckout = () : void=>{
    if (visaMethodElement.checked) {
      this.convertVND(checkoutElement.innerText = "Thanh toán bằng VISA");
    } else if (momoMethodElement.checked) {
      this.convertVND(checkoutElement.innerText = "Thanh toán bằng MOMO");
    }
  }
// Thêm sự kiện change vào các phần tử radio button
    dobMethodElement.addEventListener("change", updateShippingFee);
    storeMethodElement.addEventListener("change", updateShippingFee);
    visaMethodElement.addEventListener("change", updateCheckout);
    momoMethodElement.addEventListener("change", updateCheckout);




  }

  calculateTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.data) {
      totalPrice += item.size.PromotionPrice * item.qty;
    }
    return totalPrice;
  }
  updateQty(item: any) {
    if(item.qty < 1 || item.qty > 99) return alert('Phải nhập số lượng lớn hơn 0')
    this.data.map((i: any) => {
      if (i._id == item._id) i.qty = item.qty
      return
    })

    localStorage.setItem('cart', JSON.stringify(this.data))
  }
  showModal() {
    this.modal.classList.add("open");
  }

  hideModal() {
    this.modal.classList.remove("open");
  }

  showModal2() {
    this.modal2.classList.add("open");
  }

  hideModal2() {
    this.modal2.classList.remove("open");
  }

  showModal3() {
    this.modal3.classList.add("open");
  }
  showModal4() {
    this.modal4.classList.add("open");
  }
  hideModal3() {
    this.modal3.classList.remove("open");
  }
  hideModal4() {
    this.modal4.classList.remove("open");
  }
}
