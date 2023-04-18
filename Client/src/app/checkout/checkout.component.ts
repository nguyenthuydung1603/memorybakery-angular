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
  constructor() {}
  ngOnInit() {
    this.modal = document.querySelector(".modal");
    this.modal2 = document.querySelector(".modal2");
    this.modal3 = document.querySelector(".modal3");
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

  hideModal3() {
    this.modal3.classList.remove("open");
  }
}
