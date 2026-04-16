import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentItemCompanyComponent } from './payment-item-company.component';

describe('PaymentItemCompanyComponent', () => {
  let component: PaymentItemCompanyComponent;
  let fixture: ComponentFixture<PaymentItemCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentItemCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentItemCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
