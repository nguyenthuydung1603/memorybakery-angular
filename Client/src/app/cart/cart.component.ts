import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  @ViewChild('quantityInput') quantityInput!: ElementRef;
  value=1
  price:any
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

    changeState() {
    const val = (<HTMLInputElement>document.getElementById('input-voucher')).value;
    if (val.length > 0) {
      (<HTMLInputElement>document.getElementById('apply')).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById('apply')).disabled = true;
    }
  }
  getTotal() {
    let total = this.price * this.value;
    return isNaN(total) ? 0 : total;
  }
}
