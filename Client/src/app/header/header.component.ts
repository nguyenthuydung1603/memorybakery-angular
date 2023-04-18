import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showHeader = false;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const currentScrollPos = window.pageYOffset;
    if (this.prevScrollpos > currentScrollPos) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
    this.prevScrollpos = currentScrollPos;
  }

  prevScrollpos = window.pageYOffset;

}
