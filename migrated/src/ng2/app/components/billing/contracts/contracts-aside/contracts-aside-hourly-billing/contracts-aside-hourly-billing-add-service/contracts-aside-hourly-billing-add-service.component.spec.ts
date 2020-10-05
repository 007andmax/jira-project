import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideHourlyBillingAddServiceComponent } from './contracts-aside-hourly-billing-add-service.component';

describe('ContractsAsideHourlyBillingAddServiceComponent', () => {
  let component: ContractsAsideHourlyBillingAddServiceComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingAddServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideHourlyBillingAddServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideHourlyBillingAddServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
