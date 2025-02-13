import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../../contracts-edit/contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsUserDeviceService } from '../class/contracts-user-device-service';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideOtherProductModule } from '../contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceModule } from '../contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideUserDeviceBillingComponent } from './contracts-aside-user-device-billing.component';
import { ContractsAsideUserDeviceServiceComponent } from './contracts-aside-user-device-service/contracts-aside-user-device-service.component';
import { ContractsAsideUserDeviceServiceModule } from './contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';




describe('ContractsAsideUserDeviceBillingComponent unit test', () => {
  let component: ContractsAsideUserDeviceBillingComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceBillingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        DatePickerModule,
        FormsModule,
        NgbModule,
        ContractsAsideEditHourlyAddDefaultServiceModule,
        DecimalNumberModule,
        TaxesModule,
        ContractsAsideBlockTimeBillingCustomerServiceModule,
        ContractsAsideBlockTimeBillingDefaultServiceModule,
        ContractsAsideBlockTimeBillingAddDefaultServiceModule,
        TechUsersModule,
        ContractsAsideBlockTimeBillingUsersModule,
        ContractsAsideUserDeviceServiceModule,
        ContractsAsideOtherServiceModule,
        ContractsAsideOtherProductModule,
        NumberModule,
        CompanyDropDownModule,
        MatErrorModule,
        ContractsAsideBlockTimeBillingAddSubscriptionServicesModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })],
      declarations: [
        ContractsAsideUserDeviceBillingComponent,
        ContractsAsideTopComponent
      ],
    }).compileComponents();

  });

  it('check "contractsUserDevice"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let contractForCopy = new ServiceAgreement({
      "id": "b7cf4cc8-580d-44aa-9400-7e05c5a67f06",
      "description": "wefewfwef",
      "type": "SERVICE_CONTRACT",
      "status": "CURRENT",
      "billType": "DEVICE",
      "includedHours": null,
      "glNumber": null,
      "companyId": "32457670-d947-4de6-ab86-0731bdf02f70",
      "startDate": "2025/01/21",
      "endDate": "2075/01/20",
      "reviewDate": "2026/01/21",
      "amount": 510.98,
      "services": [
        {
          "id": "be7e6935-8975-4c69-8a75-c33aabe12f71",
          "name": "e-commerce",
          "rate": 151.13,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "74bf930c-5ae2-4764-aca6-61ebc280ced9",
          "name": "_Hourly",
          "rate": 100.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 44.0,
          "taxIds": [
            "c56f4316-4bad-4155-93d3-52f841eae15b",
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        }
      ],
      "blockTimeServices": [],
      "interval": "MONTHLY",
      "customInterval": null,
      "blockRate": null,
      "rateExceeding": null,
      "enableTimeRollover": false,
      "maxRolloverHours": null,
      "shares": [],
      "taxIds": [],
      "serviceContractServices": [
        {
          "id": "221de3db-2d1e-4fd4-a2ec-4771a130591e",
          "name": "architecture ver2",
          "rate": 199.99,
          "count": 1,
          "billable": false,
          "basedOnDefault": false,
          "commissionRate": 13.0,
          "taxIds": []
        },
        {
          "id": "6eb36d66-a2a5-4533-ba1d-06750af36bfb",
          "name": "interface",
          "rate": 199.99,
          "count": 1,
          "billable": false,
          "basedOnDefault": false,
          "commissionRate": 13.0,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "64ff9256-92dc-4a75-9e86-920725a6888c",
          "name": "aef23f ver2",
          "rate": 111.0,
          "count": 1,
          "billable": false,
          "basedOnDefault": false,
          "commissionRate": 13.0,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        }
      ],
      "serviceContractServicesToTrack": [
        {
          "id": "8d98257f-e6fa-47b9-8cc1-8c13d82da9ac",
          "name": "e-services",
          "rate": 0.0,
          "count": null,
          "billable": false,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": []
        }
      ],
      "serviceExpenses": [],
      "productExpenses": [],
      "invoiceAsSingleItem": false,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false
    });
    com.сontractsStateService.setContractForCopy(contractForCopy);
    com.onInitCopy();
    expect(com.contractsUserDevice.intervalstring).toEqual(com.selectedInterval);
    expect(com.contractsUserDevice.intervalstring).toEqual(contractForCopy.interval);
    expect(com.contractsUserDevice.services.length).toEqual(2);
    expect(com.toggleContractServices).toEqual(true);
    expect(com.toggleMaximumAmountHours).toEqual(false);
  });
  it('check "setDefaultTaxes"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let lsitTaxes = [{ isDefault: true, id: 1 }, { isDefault: false, id: 2 }, { isDefault: true, id: 3 }]
    com.setDefaultTaxes(lsitTaxes);
    expect(com.defaultSelectedTax).toEqual([{ isDefault: true, id: 1 }, { isDefault: true, id: 3 }]);
  });
  it('check "setToggleMaximumAmountHours"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    com.setToggleMaximumAmountHours(true);
    expect(com.contractsUserDevice.blockRate).toEqual(0);
    expect(com.contractsUserDevice.includedHours).toEqual("1");
    expect(com.contractsUserDevice.rateExceeding).toEqual("0.00");
    com.setToggleMaximumAmountHours(false);
    expect(com.contractsUserDevice.taxIds).toEqual(null);
    expect(com.contractsUserDevice.blockRate).toEqual(undefined);
    expect(com.contractsUserDevice.includedHours).toEqual(undefined);
    expect(com.contractsUserDevice.rateExceeding).toEqual(undefined);
  });
  it('check "onTaxesChange"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    com.onTaxesChange([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(com.contractsUserDevice.taxIds).toEqual([1, 2, 3]);
  });
  it('check "addBlockTimeService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    com.addBlockTimeService({ name: "test", rate: 100, versionedId: { id: 1 } });
    expect(com.contractsUserDevice.blockTimeServices[0].getDataForCreate(100)).toEqual(
      {
        "parentDefaultServiceId": 1,
        "basedOnDefault": true,
        rate: 100
      });
  });
  it('check "addServiceContractService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    com.addServiceContractService({ name: "test", rate: 100, taxIds: ['1', '2', '3'], id: 1 });
    expect(com.contractsUserDevice.serviceContractServices[0].getDataForCreate()).toEqual(
      {
        count: 1,
        rate: String(100),
        taxIds: ['1', '2', '3'],
        subscriptionService: { id: 1 },
        discountAmount: undefined,
        discountType: undefined
      });
  });
  it('check "getMinStartDate"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let startDate = new Date();
    let checkStartDateMONTHLY = new Date();
    let checkStartDateYEARLY = new Date();
    let checkStartDate30 = new Date();
    let checkStartDate15 = new Date();
    let checkStartDate7 = new Date();
    checkStartDateMONTHLY.setMonth(checkStartDateMONTHLY.getMonth() - 1);
    checkStartDateYEARLY.setFullYear(checkStartDateYEARLY.getFullYear() - 1);
    let day = 1000 * 60 * 60 * 24;
    expect(com.getMinStartDate("MONTHLY", startDate)).toEqual(checkStartDateMONTHLY.getTime() + day);
    expect(com.getMinStartDate("YEARLY", startDate)).toEqual(checkStartDateYEARLY.getTime() + day);
    expect(com.getMinStartDate("30 days", startDate)).toEqual(checkStartDate30.getTime() - (29 * day));
    expect(com.getMinStartDate("15 days", startDate)).toEqual(checkStartDate15.getTime() - (14 * day));
    expect(com.getMinStartDate("7 days", startDate)).toEqual(checkStartDate7.getTime() - (6 * day));
  });
  it('check "onAddDefaultService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let data = { billable: true, commissionRate: 10, versionedId: { id: 1 }, name: "test", rate: 100, taxes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }], parentDefaultServiceId: "test", discountAmount: 1000, discountType: "PERCENT" };
    com.onAddDefaultService(data);
    expect(com.contractsUserDevice.services[0].getDataForCreate()).toEqual({
      parentDefaultServiceId: "test",
      basedOnDefault: true,
      billable: true,
      commissionRate: 10,
      rate: 100,
      taxIds: [1, 2, 3, 4, 5],
      discountAmount: 1000,
      discountType: "PERCENT"
    });
    expect(com.contractsUserDevice.services[0].getDataForUpdate()).toEqual({
      basedOnDefault: true,
      billable: true,
      commissionRate: 10,
      rate: 100,
      taxIds: [1, 2, 3, 4, 5],
      discountAmount: 1000,
      discountType: "PERCENT",
      parentDefaultServiceId: "test",
      id: 1
    });
  });
});