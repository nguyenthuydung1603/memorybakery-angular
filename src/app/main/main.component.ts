import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  backToTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
