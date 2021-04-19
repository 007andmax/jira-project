import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingAddDefaultServiceComponent } from './contracts-aside-block-time-billing-add-default-service.component';

describe('ContractsAsideBlockTimeBillingAddDefaultServiceComponent', () => {
  let component: ContractsAsideBlockTimeBillingAddDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingAddDefaultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingAddDefaultServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingAddDefaultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
