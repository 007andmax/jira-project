import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { TicketProfileUpdatesServiceDurationModule } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../../contracts-edit/contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsOtherService } from '../class/contracts-other-service';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideUserDeviceServiceModule } from '../contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideOtherProductModule } from './contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceModule } from './contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideProductServiceContractsComponent } from './contracts-aside-product-service-contracts.component';
import { ContractsAsideBlockTimeBillingComponent } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing.component';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from '../contracts-aside-hourly-billing/contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
import { ContractsAsideHourlyBillingComponent } from '../contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';
import { ContractsAsideSelectTypeComponent } from '../contracts-aside-select-type/contracts-aside-select-type.component';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { ContractsAsideUserDeviceBillingComponent } from '../contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideComponent } from '../contracts-aside.component';
import { ServiceAgreement } from '../../class/service-agreement';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerIntervalsModule } from '../date-picker-intervals/date-picker-intervals.module';



describe('ContractsAsideProductServiceContractsComponent unit test', () => {
  let component: ContractsAsideProductServiceContractsComponent;
  let fixture: ComponentFixture<ContractsAsideProductServiceContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        DatePickerModule,
        FormsModule,
        NgbModule,
        DecimalNumberModule,
        TaxesModule,
        ContractsAsideBlockTimeBillingCustomerServiceModule,
        ContractsAsideBlockTimeBillingDefaultServiceModule,
        ContractsAsideBlockTimeBillingAddDefaultServiceModule,
        TechUsersModule,
        ContractsAsideBlockTimeBillingUsersModule,
        ContractsAsideUserDeviceServiceModule,
        NumberModule,
        CompanyDropDownModule,
        MatErrorModule,
        ContractsAsideBlockTimeBillingAddSubscriptionServicesModule,
        ContractsAsideEditHourlyAddDefaultServiceModule,
        ContractsAsideOtherServiceModule,
        ContractsAsideOtherProductModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DatePickerIntervalsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [
        ContractsAsideSelectTypeComponent,
        ContractsAsideUserDeviceBillingComponent,
        ContractsAsideProductServiceContractsComponent,
        ContractsAsideTopComponent,
        ContractsAsideHourlyBillingDefaultServiceComponent
      ],
    }).compileComponents();

  });

  it('check "addService()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServiceContractsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addService();
    expect(com.contractsOther.serviceExpenses[0].getDataForCrate()).toEqual({
      date: com.contractsOther.serviceExpenses[0].date,
      description: "",
      quantity: 0,
      serviceId: "",
    });
  });
  it('check "addProduct()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServiceContractsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addProduct();
    expect(com.contractsOther.productExpenses[0].getDataForCrate()).toEqual({
      productId: "",
      quantity: 0,
      salePrice: 0,
      discountAmount: undefined,
      discountType: undefined
    });
  });
  it('check "onInitCopy"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServiceContractsComponent);
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
    com.companiesStateService.currentCompany = { addresses: [{ timeZone: { timeOffset: 6000 } }] };
    com.сontractsStateService.setContractForCopy(contractForCopy);
    com.onInitCopy()
    expect(com.selectedInterval).toEqual(com.contractsOther.intervalstring);
  });
});