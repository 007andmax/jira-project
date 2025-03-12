import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideUserDeviceServiceModule } from '../contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideHourlyBillingComponent } from './contracts-aside-hourly-billing.component';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { ContractsAsideBlockTimeBillingComponent } from '../contracts-aside-block-time-billing/contracts-aside-block-time-billing.component';
import { ContractsAsideProductServiceContractsComponent } from '../contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';
import { ContractsAsideSelectTypeComponent } from '../contracts-aside-select-type/contracts-aside-select-type.component';
import { ContractsAsideUserDeviceBillingComponent } from '../contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideComponent } from '../contracts-aside.component';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from './contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../../contracts-edit/contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsAsideOtherServiceModule } from '../contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideOtherProductModule } from '../contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideHourlyBillingComponent unit test', () => {
  let component: ContractsAsideHourlyBillingComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingComponent>;

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
      ],
    }).compileComponents();

  });

  it('check "onInitCopy()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideHourlyBillingComponent);
    const com = fixture.debugElement.componentInstance;
    let contractForCopy = new ServiceAgreement({
      "id": "f218b3db-a28f-429d-972e-02ba50034d1c",
      "description": "ewfwfwef",
      "type": "HOURLY",
      "status": "CURRENT",
      "billType": null,
      "includedHours": null,
      "glNumber": null,
      "companyId": "e3943406-4072-4fa6-af60-e821ab60a27d",
      "startDate": "2025/01/21",
      "endDate": "2035/01/21",
      "reviewDate": "2026/01/21",
      "amount": 0.00,
      "services": [
        {
          "id": "c4ffb480-fff6-4141-84ad-ee996996ea00",
          "name": "new service 2025",
          "rate": 100.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "961a3401-660d-44e3-95d0-ebfb6a982830",
          "name": "new service V2 - 2025",
          "rate": 200.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "fab3c984-c501-43f3-a0fb-2d62a4e939ba",
          "name": "new test service3 something else1212",
          "rate": 125.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 1.0,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "8319ec70-d04c-4c3b-b758-e14cf944aa44",
          "name": "test 2",
          "rate": 11.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "2893389a-b096-4aa0-a564-a8a474d01a85"
          ]
        },
        {
          "id": "b8e61119-addb-43c3-9b22-873299b6ab66",
          "name": "test service",
          "rate": 3.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "2251a824-119e-4919-bd82-e3d2ed8b8692",
          "name": "tyyt",
          "rate": 11.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 1.0,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "2c491f82-cf90-4d7d-b119-cd4618eb4585",
          "name": "uie8gyer98gyer p98gyer g9y e8py ee8gy reyg reiyg yeruigregr euigyeiue eiug eiug eiugeigergergergerg",
          "rate": 33.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "e81600df-73e3-4c5e-b750-c47238bfe8ee",
          "name": "65utyut",
          "rate": 34.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 22.0,
          "taxIds": []
        },
        {
          "id": "f03b0930-3123-406b-a97e-4672c9c79455",
          "name": "Managed servers",
          "rate": 50.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "fcfdcfbf-3902-4339-8d9d-899c9752c60c",
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "398f931e-6e5f-429b-84d9-a78fe953f3e6",
          "name": "On site service",
          "rate": 110.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 11.0,
          "taxIds": [
            "dd6f1583-10ad-4167-a62f-fe58a997c5c8"
          ]
        },
        {
          "id": "6c371ed8-6f48-47da-8b1d-c2255edaf20d",
          "name": "On site block time service 777",
          "rate": 5.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": []
        },
        {
          "id": "b377aa71-a5b5-4d2f-b5d2-f85494258db0",
          "name": "Remote block time service",
          "rate": 5.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": []
        },
        {
          "id": "f65dd896-5888-496c-aef1-3463243eec54",
          "name": "Ukraine",
          "rate": 120.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 7.0,
          "taxIds": []
        },
        {
          "id": "f5d876c4-e174-43a2-a410-c0148e99e9d1",
          "name": "Managed Services Onsite3",
          "rate": 0.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": []
        },
        {
          "id": "98b205fc-6cb6-479c-b183-ed62d1adc368",
          "name": "Managed Services Remote",
          "rate": 0.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": []
        },
        {
          "id": "7778eb19-3d96-4bfc-8a3f-1c01afc6cfde",
          "name": "Managed Services Remote3",
          "rate": 0.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": []
        },
        {
          "id": "501a4429-bb56-4ae9-9f66-aa97fd910bfb",
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
          "id": "66a64e21-5404-45b1-87ea-9587fbd64de3",
          "name": "e-services",
          "rate": 883.68,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "f5eb5822-55ee-4004-905a-200b0b3b3aa2",
          "name": "efwefwefwfwef",
          "rate": 11.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "fcfdcfbf-3902-4339-8d9d-899c9752c60c",
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ]
        },
        {
          "id": "a30fa947-c193-4655-9a99-2050cfc6c7ca",
          "name": "infrastructures",
          "rate": 316.4,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "e35b6e4c-6961-4ef5-b5ff-2a4a0ea17df7"
          ]
        },
        {
          "id": "8ae3d616-3683-42e2-a410-31f369168363",
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
      "interval": null,
      "customInterval": null,
      "blockRate": null,
      "rateExceeding": null,
      "enableTimeRollover": false,
      "maxRolloverHours": null,
      "shares": [],
      "taxIds": [],
      "serviceContractServices": [],
      "serviceContractServicesToTrack": [],
      "serviceExpenses": [],
      "productExpenses": [],
      "invoiceAsSingleItem": false,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false
    })
    com.contractsStateService.setContractForCopy(contractForCopy);
    com.onInitCopy();
    expect(com.selectAllServices).toEqual(true);
    expect(com.startDate).toEqual(com.contractsStateService.getContractForCopy().getStartDateByMilliseconds());
    expect(com.startDateDP.minDate).toEqual(com.contractsStateService.getContractForCopy().getStartDateByMilliseconds());
    expect(com.reviewDate).toEqual(com.contractsStateService.getContractForCopy().getReviewDateByMilliseconds());
    expect(com.reviewDateDP.minDate).toEqual(com.contractsStateService.getContractForCopy().getReviewDateByMilliseconds());
  });
});