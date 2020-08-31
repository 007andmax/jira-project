import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideHourlyBillingComponent } from './contracts-aside-hourly-billing.component';

describe('ContractsAsideHourlyBillingComponent', () => {
  let component: ContractsAsideHourlyBillingComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideHourlyBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideHourlyBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
