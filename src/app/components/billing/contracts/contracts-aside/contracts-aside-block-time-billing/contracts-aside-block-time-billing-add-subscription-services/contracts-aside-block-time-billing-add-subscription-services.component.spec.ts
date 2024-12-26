import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent } from './contracts-aside-block-time-billing-add-subscription-services.component';

describe('ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent', () => {
  let component: ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
