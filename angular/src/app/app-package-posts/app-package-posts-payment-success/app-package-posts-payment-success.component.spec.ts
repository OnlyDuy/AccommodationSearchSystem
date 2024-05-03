import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPackagePostsPaymentSuccessComponent } from './app-package-posts-payment-success.component';

describe('AppPackagePostsPaymentSuccessComponent', () => {
  let component: AppPackagePostsPaymentSuccessComponent;
  let fixture: ComponentFixture<AppPackagePostsPaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPackagePostsPaymentSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPackagePostsPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
