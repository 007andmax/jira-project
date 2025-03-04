import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit.component';
import { DefaultServicesHourlyContract } from '../../contracts-aside/class/default-service-hourly-contract';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideOtherProductModule } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceModule } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideUserDeviceServiceModule } from '../../contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from './contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsAsideHourlyBillingEditDefaultServiceComponent } from './contracts-aside-hourly-billing-edit-default-service/contracts-aside-hourly-billing-edit-default-service.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ContractsAsideHourlyEditComponent unit test', () => {
  let component: ContractsAsideHourlyEditComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        DatePickerModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        TaxesModule,
        DecimalNumberModule,
        ContractsAsideBlockTimeBillingDefaultServiceModule,
        ContractsAsideBlockTimeBillingAddDefaultServiceModule,
        TechUsersModule,
        ContractsAsideBlockTimeBillingUsersModule,
        ContractsAsideUserDeviceServiceModule,
        ContractsAsideBlockTimeBillingCustomerServiceModule,
        ContractsAsideOtherServiceModule,
        ContractsAsideOtherProductModule,
        NumberModule,
        ContractsAsideEditHourlyAddDefaultServiceModule,
        MatErrorModule,
        ContractsAsideBlockTimeBillingAddSubscriptionServicesModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ContractsAsideHourlyEditComponent,
        ContractsAsideHourlyBillingEditDefaultServiceComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideHourlyEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.onAddService(new DefaultServicesHourlyContract({ billable: true, commissionRate: 125, versionedId: { id: "test" }, name: "test", rate: 500, taxes: [{ id: "1" }, { id: "2" }, { id: "3" }], parentDefaultServiceId: "test 123", discountAmount: 520, discountType: "PERCENT" }));
    expect(com.contractsHourly.services.length).toEqual(1);
    expect(com.contractsHourly.services[0].getDataForCreate()).toEqual({
      parentDefaultServiceId: "test 123",
      basedOnDefault: true,
      billable: true,
      commissionRate: 125,
      rate: 500,
      taxIds: ["1", "2", "3"],
      discountAmount: 520,
      discountType: "PERCENT"
    });
    expect(com.contractsHourly.services[0].getDataForUpdate()).toEqual({
      basedOnDefault: true,
      billable: true,
      commissionRate: 125,
      rate: 500,
      taxIds: ["1", "2", "3"],
      discountAmount: 520,
      discountType: "PERCENT",
      parentDefaultServiceId: "test"
    });
  });
});