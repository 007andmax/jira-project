import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';

describe('ContractsAsideBlockTimeBillingUsersComponent', () => {
  let component: ContractsAsideBlockTimeBillingUsersComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
