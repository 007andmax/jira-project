import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { ContractsAsideBlockTimeBillingComponent } from './contracts-aside-block-time-billing.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../../contracts-edit/contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from '../contracts-aside-hourly-billing/contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
import { ContractsAsideHourlyBillingComponent } from '../contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';
import { ContractsAsideOtherProductModule } from '../contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceModule } from '../contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideProductServiceContractsComponent } from '../contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';
import { ContractsAsideSelectTypeComponent } from '../contracts-aside-select-type/contracts-aside-select-type.component';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { ContractsAsideUserDeviceBillingComponent } from '../contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideUserDeviceServiceModule } from '../contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideComponent } from '../contracts-aside.component';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from './contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from './contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from './contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from './contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from './contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ServiceAgreement } from '../../class/service-agreement';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ContractsAsideBlockTimeBillingComponent unit test', () => {
  let component: ContractsAsideBlockTimeBillingComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingComponent>;

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
        }),
        NoopAnimationsModule],
      declarations: [ContractsAsideComponent,
        ContractsAsideSelectTypeComponent,
        ContractsAsideHourlyBillingComponent,
        ContractsAsideBlockTimeBillingComponent,
        ContractsAsideUserDeviceBillingComponent,
        ContractsAsideProductServiceContractsComponent,
        ContractsAsideTopComponent,
        ContractsAsideHourlyBillingDefaultServiceComponent
      ]
    }).compileComponents();

  });

  it('check "ngOnInit"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
    const com = fixture.debugElement.componentInstance;
    com.companiesStateService.currentCompany = { addresses: [{ timeZone: { timeOffset: 7200000 } }] };
    com.ngOnInit();
    let reviewDate = new Date();
    reviewDate.setFullYear(reviewDate.getFullYear() + 1);
    expect(new Date(com.reviewDate).getFullYear()).toEqual(reviewDate.getFullYear());
  });
  it('check "setDefaultTaxes"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let lsitTaxes = [{ isDefault: true, id: 1 }, { isDefault: false, id: 2 }, { isDefault: true, id: 3 }]
    com.setDefaultTaxes(lsitTaxes);
    expect(com.contractsBlockTime.taxIds).toEqual([1, 3]);
  });
  it('check "getMinStartDate"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
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
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
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
      parentDefaultServiceId: "test",
      id: 1
    });
  });
  it('check "addCustomService"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let data = { name: "test", rate: "100", versionedId: { id: "123" } };
    com.addCustomService(data);
    expect(com.contractsBlockTime.blockTimeServices.length).toEqual(1);
    expect(com.contractsBlockTime.blockTimeServices[0].getDataForCreate(300)).toEqual({
      "parentDefaultServiceId": "123",
      "basedOnDefault": true,
      rate: 300
    });
  });
  it('check "onInitCopy"', () => {
    const fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let contractForCopy = new ServiceAgreement({
      subtotalExcludingTax: 6,
      billType: null,
      blockRate: "3",
      blockRate_str: "3.00",
      blockTimeServices: [
        {
          "id": "592dd3f1-acb7-41ff-bd4b-10de07951f1a",
          "name": "_Hourly",
          "rate": 2.0,
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
      companyId: "a415697a-cf89-41b5-820c-6351f5a8a13e",
      customInterval: null,
      description: "wefwef",
      enableInvoiceAutoCreate: false,
      enableTimeRollover: false,
      endDate: "2075/01/22",
      glNumber: null,
      id: "fe883e33-bf57-4057-88ed-1248f2819cac",
      includedHours: 2,
      interval: "MONTHLY",
      invoiceAsSingleItem: false,
      manualCreateBillableItem: false,
      maxRolloverHours: "",
      productExpenses: [],
      rateExceeding: "2",
      rateExceeding_str: "2.00",
      reviewDate: "2026/01/23",
      serviceContractServices: [],
      serviceContractServicesToTrack: [],
      serviceExpenses: [],
      services: [
        {
          "id": "4511786e-398f-4a4a-bc44-7319c00eba87",
          "name": "new service V2 - 2025",
          "rate": 200.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": 23.0000,
          "discountType": "PERCENT",
          "discountSum": 46.0000,
          "parentDefaultServiceId": "17088515-59c9-4523-aa8d-680628a9cb2f"
        }
      ],
      shares: [],
      startDate: "2025/01/23",
      status: "CURRENT",
      taxIds: ['8d321592-ffbd-487a-95c5-4789fa9a58c6'],
      type: "BLOCK_TIME"
    });
    com.companiesStateService.currentCompany = { addresses: [{ timeZone: { timeOffset: 6000 } }] };
    com.сontractsStateService.setContractForCopy(contractForCopy);
    com.onInitCopy()
    expect(com.contractsBlockTime.intervalstring).toEqual(com.selectedInterval);
    expect(com.contractsBlockTime.intervalstring).toEqual(contractForCopy.interval);
    expect(com.contractsBlockTime.services.length).toEqual(1);
    expect(com.toggleContractServices).toEqual(true);
    expect(com.toggleTimeRollover).toEqual(false);
    expect(com.toggleNotifyAgentsUser).toEqual(false);
  });
});