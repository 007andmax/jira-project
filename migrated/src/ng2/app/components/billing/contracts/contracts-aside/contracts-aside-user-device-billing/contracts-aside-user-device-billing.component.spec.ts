import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideUserDeviceBillingComponent } from './contracts-aside-user-device-billing.component';

describe('ContractsAsideUserDeviceBillingComponent', () => {
  let component: ContractsAsideUserDeviceBillingComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideUserDeviceBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
