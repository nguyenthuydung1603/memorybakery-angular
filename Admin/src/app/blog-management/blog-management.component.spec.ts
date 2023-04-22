import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogManagementComponent } from './blog-management.component';

describe('BlogManagementComponent', () => {
  let component: BlogManagementComponent;
  let fixture: ComponentFixture<BlogManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
