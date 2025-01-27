import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { ServiceAgreementBlockTimeServices } from '../../../class/service-agreement-block-time-services';
import { ContractsAsideBlockTimeEditCustomerServiceComponent } from './contracts-aside-block-time-edit-customer-service.component';
import { FormsModule } from '@angular/forms';



describe('ContractsAsideBlockTimeEditCustomerServiceComponent unit test', () => {
  let component: ContractsAsideBlockTimeEditCustomerServiceComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeEditCustomerServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        FormsModule,
        MatErrorModule],
      declarations: [ContractsAsideBlockTimeEditCustomerServiceComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeEditCustomerServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ServiceAgreementBlockTimeServices({
      basedOnDefault: false,
      billable: false,
      commissionRate: 100,
      count: 2,
      id: "test",
      name: "name",
      rate: 200,
      taxIds: ["1", "2", "3"],
      subscriptionService: { id: "567" },
      parentDefaultServiceId: "123",
      discountAmount: 200,
      discountSum: 300,
      discountType: "PERCENT"
    })
    expect(com.service.getDataForUpdate()).toEqual({
      basedOnDefault: false,
      billable: false,
      commissionRate: 100,
      count: 2,
      id: "test",
      name: "name",
      rate: 200,
      taxIds: ["1", "2", "3"],
    });
    expect(com.service.getDataForUpdateSubscriptionServices()).toEqual({
      "basedOnDefault": false,
      "rate": 200,
      billable: false,
      taxIds: ["1", "2", "3"],
      id: "test",
      parentDefaultServiceId: "123",
      count: 2,
      commissionRate: 100,
    });
    expect(com.service.getDataForUpdateContractServices()).toEqual({
      count: 2,
      "rate": 200,
      taxIds: ["1", "2", "3"],
      subscriptionService: {
        id: "567"
      },
      discountAmount: 200,
      discountType: "PERCENT",
      id: "test",
    });
  });
});