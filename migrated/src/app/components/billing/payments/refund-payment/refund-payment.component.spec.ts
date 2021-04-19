import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundPaymentComponent } from './refund-payment.component';

describe('RefundPaymentComponent', () => {
  let component: RefundPaymentComponent;
  let fixture: ComponentFixture<RefundPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
