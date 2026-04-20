import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideOtherProductModule } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceModule } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideUserDeviceServiceModule } from '../../contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsAsideBlockTimeEditComponent } from './contracts-aside-block-time-edit.component';
import { ServiceAgreement } from '../../class/service-agreement';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DefaultServicesHourlyContract } from '../../contracts-aside/class/default-service-hourly-contract';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerIntervalsModule } from '../../contracts-aside/date-picker-intervals/date-picker-intervals.module';



describe('ContractsAsideBlockTimeEditComponent unit test', () => {
  let component: ContractsAsideBlockTimeEditComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeEditComponent>;

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
        }), NoopAnimationsModule, ContractsAsideBlockTimeEditComponent],
}).compileComponents();

  });

  it('check "ngOnInit()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeEditComponent);
    const com = fixture.debugElement.componentInstance;
    let contractsBlockTime = new ServiceAgreement({
      "id": "520f1905-e02e-4ce9-a055-40ad02953bcd",
      "description": "sefewf",
      "type": "BLOCK_TIME",
      "status": "CURRENT",
      "billType": null,
      "includedHours": 2.0,
      "glNumber": null,
      "companyId": "4a6f8299-67b2-4f52-814e-2aabf0e3362a",
      "startDate": "2025/01/23",
      "endDate": "2075/01/22",
      "reviewDate": "2026/01/23",
      "amount": 6.00,
      "services": [
        {
          "id": "e1118706-915c-478c-ac5a-5b91aed481f7",
          "name": "Managed Services Remote",
          "rate": 0.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [],
          "subscriptionService": null,
          "discountAmount": 23.0000,
          "discountType": "PERCENT",
          "discountSum": 0.0000,
          "parentDefaultServiceId": "9315f7f1-831a-4a51-bb1b-dd5042457fa8"
        }
      ],
      "blockTimeServices": [
        {
          "id": "1cddc81d-8c1a-4969-b9e2-149c1df529ef",
          "name": "_Hourly",
          "rate": 4.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "9ce617fa-32e8-426c-9fdd-5391426f8392"
        }
      ],
      "interval": "MONTHLY",
      "customInterval": null,
      "blockRate": 3.0,
      "rateExceeding": 4.0,
      "enableTimeRollover": false,
      "maxRolloverHours": null,
      "shares": [],
      "taxIds": [
        "8d321592-ffbd-487a-95c5-4789fa9a58c6"
      ],
      "serviceContractServices": [],
      "serviceContractServicesToTrack": [],
      "serviceExpenses": [],
      "productExpenses": [],
      "invoiceAsSingleItem": false,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false
    });
    com.contractsBlockTime = contractsBlockTime;
    com.ngOnInit();
    expect(com.selectedInterval).toEqual(com.contractsBlockTime.interval);
    expect(com.toggleContractServices).toEqual(true);
    expect(com.toggleTimeRollover).toEqual(false);
    expect(com.toggleNotifyAgentsUser).toEqual(false);
  });
  it('check "onAddDefaultService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeEditComponent);
    const com = fixture.debugElement.componentInstance;
    let data = { billable: true, commissionRate: 10, versionedId: { id: 1 }, name: "test", rate: 100, taxes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }], parentDefaultServiceId: "test", discountAmount: 1000, discountType: "PERCENT" };
    com.onAddDefaultService(data);
    expect(com.contractsBlockTime.services[0].getDataForCreate()).toEqual({
      parentDefaultServiceId: "test",
      basedOnDefault: true,
      billable: true,
      commissionRate: 10,
      rate: 100,
      taxIds: [1, 2, 3, 4, 5],
      discountAmount: 1000,
      discountType: "PERCENT"
    });
    expect(com.contractsBlockTime.services[0].getDataForUpdate()).toEqual({
      basedOnDefault: true,
      billable: true,
      commissionRate: 10,
      rate: 100,
      taxIds: [1, 2, 3, 4, 5],
      discountAmount: 1000,
      discountType: "PERCENT",
      parentDefaultServiceId: 1
    });
  });
  it('check "addCustomService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeEditComponent);
    const com = fixture.debugElement.componentInstance;
    let data = new DefaultServicesHourlyContract({
      count: 1,
      versionedId: { id: 1 },
      name: "name",
      rate: 10,
      taxes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      billable: true,
      commissionRate: 11
    });
    com.addCustomService(data);
    expect(com.contractsBlockTime.blockTimeServices[0].getDataForUpdate()).toEqual({
      basedOnDefault: true,
      billable: undefined,
      commissionRate: undefined,
      count: 1,
      id: 1,
      name: "name",
      rate: 10,
      taxIds: [1, 2, 3, 4, 5]
    });
  });
});