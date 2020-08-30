import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingComponent } from './contracts-aside-block-time-billing.component';

describe('ContractsAsideBlockTimeBillingComponent', () => {
  let component: ContractsAsideBlockTimeBillingComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
