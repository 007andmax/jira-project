import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeEditCustomerServiceComponent } from './contracts-aside-block-time-edit-customer-service.component';

describe('ContractsAsideBlockTimeEditCustomerServiceComponent', () => {
  let component: ContractsAsideBlockTimeEditCustomerServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeEditCustomerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeEditCustomerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeEditCustomerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
