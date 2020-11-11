import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingCustomerServiceComponent } from './contracts-aside-block-time-billing-customer-service.component';

describe('ContractsAsideBlockTimeBillingCustomerServiceComponent', () => {
  let component: ContractsAsideBlockTimeBillingCustomerServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingCustomerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingCustomerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingCustomerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
