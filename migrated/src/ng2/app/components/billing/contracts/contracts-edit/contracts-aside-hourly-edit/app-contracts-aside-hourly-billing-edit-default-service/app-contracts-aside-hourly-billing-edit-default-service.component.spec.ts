import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContractsAsideHourlyBillingEditDefaultServiceComponent } from './app-contracts-aside-hourly-billing-edit-default-service.component';

describe('AppContractsAsideHourlyBillingEditDefaultServiceComponent', () => {
  let component: AppContractsAsideHourlyBillingEditDefaultServiceComponent;
  let fixture: ComponentFixture<AppContractsAsideHourlyBillingEditDefaultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppContractsAsideHourlyBillingEditDefaultServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppContractsAsideHourlyBillingEditDefaultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
