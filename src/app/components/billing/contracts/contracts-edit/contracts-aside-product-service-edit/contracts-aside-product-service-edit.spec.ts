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
import { ContractsAsideProductServiceEditComponent } from './contracts-aside-product-service-edit.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerIntervalsModule } from '../../contracts-aside/date-picker-intervals/date-picker-intervals.module';




describe('ContractsAsideProductServiceEditComponent unit test', () => {
  let component: ContractsAsideProductServiceEditComponent;
  let fixture: ComponentFixture<ContractsAsideProductServiceEditComponent>;

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
        DatePickerIntervalsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, ContractsAsideProductServiceEditComponent],
}).compileComponents();

  });

  it('check "addService()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServiceEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.addService();
    expect(com.contractsOther.serviceExpenses[0].getDataForUpdate()).toEqual({
      date: com.contractsOther.serviceExpenses[0].date,
      description: "",
      quantity: 0,
      serviceExpenseDurationEnd: null,
      serviceExpenseDurationStart: null,
      serviceId: "",
    });
  });
  it('check "addProduct()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServiceEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.addProduct();
    expect(com.contractsOther.productExpenses[0].getDataForCrate()).toEqual({
      versionedId: "",
      quantity: 0,
      salePrice: 0,
      discountAmount: undefined,
      discountType: undefined,
    });
  });
});