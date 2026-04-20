import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsOtherService } from '../../contracts-aside/class/contracts-other-service';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideOtherProductModule } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceComponent } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.component';
import { ContractsAsideOtherServiceModule } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideUserDeviceServiceModule } from '../../contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsAsideUserDeviceEditComponent } from './contracts-aside-user-device-edit.component';
import { SubscriptionServices } from '../../../subscription-services/class/subscription-services';
import { count } from 'console';
import { DefaultServicesHourlyContract } from '../../contracts-aside/class/default-service-hourly-contract';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerIntervalsModule } from '../../contracts-aside/date-picker-intervals/date-picker-intervals.module';




describe('ContractsAsideUserDeviceEditComponent unit test', () => {
  let component: ContractsAsideUserDeviceEditComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceEditComponent>;

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
        DatePickerIntervalsModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, ContractsAsideUserDeviceEditComponent],
}).compileComponents();

  });

  it('check "setDefaultTaxes"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceEditComponent);
    const com = fixture.debugElement.componentInstance;
    let lsitTaxes = [{ isDefault: true, id: 1 }, { isDefault: false, id: 2 }, { isDefault: true, id: 3 }]
    com.setDefaultTaxes(lsitTaxes);
    expect(com.defaultSelectedTax).toEqual([{ isDefault: true, id: 1 }, { isDefault: true, id: 3 }]);
  });
  it('check "setToggleMaximumAmountHours"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.setToggleMaximumAmountHours(true);
    expect(com.contractsUserDevice.blockRate).toEqual("0");
    expect(com.contractsUserDevice.includedHours).toEqual(0);
    expect(com.contractsUserDevice.rateExceeding).toEqual("0.00");
    com.setToggleMaximumAmountHours(false);
    expect(com.contractsUserDevice.taxIds).toEqual(null);
    expect(com.contractsUserDevice.blockRate).toEqual(undefined);
    expect(com.contractsUserDevice.includedHours).toEqual(undefined);
    expect(com.contractsUserDevice.rateExceeding).toEqual(undefined);
  });
  it('check "addBlockTimeService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.addBlockTimeService(new DefaultServicesHourlyContract({
      count: 1,
      versionedId: { id: 1 },
      name: "test",
      rate: 0,
      taxes: [{ id: '1' }, { id: '2' }, { id: '3' }],
      basedOnDefault: true
    }));
    expect(com.contractsUserDevice.blockTimeServices[0].getDataForUpdate()).toEqual(
      {
        basedOnDefault: true,
        billable: undefined,
        commissionRate: undefined,
        count: 1,
        id: 1,
        name: "test",
        rate: 0,
        taxIds: ['1', '2', '3'],
      });
    expect(com.contractsUserDevice.blockTimeServices[0].getDataForUpdateSubscriptionServices()).toEqual(
      {
        "basedOnDefault": true,
        "rate": 0,
        billable: undefined,
        taxIds: ['1', '2', '3'],
        count: 1,
        parentDefaultServiceId: 1
      });
  });
  it('check "addServiceContractService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.addServiceContractService(new SubscriptionServices({ name: "test", rate: 0, taxIds: ['1', '2', '3'], subscriptionService: { id: 1 }, id: 1, glNumberId: "test-123" }));
    expect(com.contractsUserDevice.serviceContractServices[0].getDataForUpdate()).toEqual(
      {
        basedOnDefault: true,
        billable: undefined,
        commissionRate: undefined,
        count: 1,
        id: 1,
        name: "test",
        rate: 0,
        taxIds: ['1', '2', '3'],
      });
    expect(com.contractsUserDevice.serviceContractServices[0].getDataForUpdateSubscriptionServices()).toEqual(
      {
        "basedOnDefault": true,
        "rate": 0,
        billable: undefined,
        taxIds: ['1', '2', '3'],
        count: 1,
        parentDefaultServiceId: 1
      });
    expect(com.contractsUserDevice.serviceContractServices[0].getDataForUpdateContractServices()).toEqual(
      {
        "count": 1,
        "rate": 0,
        "taxIds": ['1', '2', '3'],
        "subscriptionService": {
          "id": 1
        },
        "discountAmount": undefined,
        "discountType": undefined
      });
  });
});