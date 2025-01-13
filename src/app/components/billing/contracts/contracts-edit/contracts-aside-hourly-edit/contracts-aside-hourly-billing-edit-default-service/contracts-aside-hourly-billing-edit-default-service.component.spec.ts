import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideHourlyBillingEditDefaultServiceComponent } from './contracts-aside-hourly-billing-edit-default-service.component';

describe('ContractsAsideHourlyBillingEditDefaultServiceComponent', () => {
  let component: ContractsAsideHourlyBillingEditDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingEditDefaultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContractsAsideHourlyBillingEditDefaultServiceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideHourlyBillingEditDefaultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
