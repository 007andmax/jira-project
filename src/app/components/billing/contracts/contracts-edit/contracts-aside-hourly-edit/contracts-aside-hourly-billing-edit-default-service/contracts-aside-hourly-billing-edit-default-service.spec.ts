import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DefaultServicesHourlyContract } from '../../../contracts-aside/class/default-service-hourly-contract';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesModule } from '../../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-subscription-services/contracts-aside-block-time-billing-add-subscription-services.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from '../../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../../../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideOtherProductModule } from '../../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { ContractsAsideOtherServiceModule } from '../../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideUserDeviceServiceModule } from '../../../contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideEditHourlyAddDefaultServiceComponent } from '../contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.component';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { ContractsAsideHourlyBillingEditDefaultServiceComponent } from './contracts-aside-hourly-billing-edit-default-service.component';
import { ContractsHourlyService } from '../../../contracts-aside/class/contracts-hourly-service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ContractsAsideHourlyBillingEditDefaultServiceComponent unit test', () => {
  let component: ContractsAsideHourlyBillingEditDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingEditDefaultServiceComponent>;

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
        NoopAnimationsModule, ContractsAsideHourlyBillingEditDefaultServiceComponent],
}).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideHourlyBillingEditDefaultServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsHourlyService(true, true, 1500, "test", "name", 120, ["1", "2", "3"], "123", false, 1000, "PERCENT");
    com.onChangeDiscountAmount(300);
    expect(com.service.discountAmount).toEqual(300);
    com.onChangeRate("124");
    expect(com.service.rate).toEqual(124);
  });
});