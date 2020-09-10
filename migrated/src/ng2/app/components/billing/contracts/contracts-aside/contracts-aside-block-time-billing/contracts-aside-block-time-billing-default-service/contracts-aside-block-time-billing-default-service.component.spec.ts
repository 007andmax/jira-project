import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingDefaultServiceComponent } from './contracts-aside-block-time-billing-default-service.component';

describe('ContractsAsideBlockTimeBillingDefaultServiceComponent', () => {
  let component: ContractsAsideBlockTimeBillingDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingDefaultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingDefaultServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingDefaultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
