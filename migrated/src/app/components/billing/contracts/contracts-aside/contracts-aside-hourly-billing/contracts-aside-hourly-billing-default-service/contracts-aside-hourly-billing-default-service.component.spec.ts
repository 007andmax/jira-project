import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideHourlyBillingDefaultServiceComponent } from './contracts-aside-hourly-billing-default-service.component';

describe('ContractsAsideHourlyBillingDefaultServiceComponent', () => {
  let component: ContractsAsideHourlyBillingDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingDefaultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideHourlyBillingDefaultServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideHourlyBillingDefaultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
