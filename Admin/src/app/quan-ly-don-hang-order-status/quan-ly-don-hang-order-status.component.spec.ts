import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyDonHangOrderStatusComponent } from './quan-ly-don-hang-order-status.component';

describe('QuanLyDonHangOrderStatusComponent', () => {
  let component: QuanLyDonHangOrderStatusComponent;
  let fixture: ComponentFixture<QuanLyDonHangOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyDonHangOrderStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLyDonHangOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
