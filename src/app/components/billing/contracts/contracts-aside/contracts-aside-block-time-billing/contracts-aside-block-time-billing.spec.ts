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
        })],
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
});