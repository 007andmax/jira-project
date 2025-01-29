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
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })],
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
    });
  });
  it('check "getMinStartDate"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServiceContractsComponent);
    const com = fixture.debugElement.componentInstance;
    let startDate = new Date();
    let checkStartDateMONTHLY = new Date();
    let checkStartDateYEARLY = new Date();
    let checkStartDate30 = new Date();
    let checkStartDate15 = new Date();
    let checkStartDate7 = new Date();
    checkStartDateMONTHLY.setMonth(checkStartDateMONTHLY.getMonth() - 1);
    checkStartDateYEARLY.setFullYear(checkStartDateYEARLY.getFullYear() - 1);
    console.log("checkStartDateMONTHLY", checkStartDateMONTHLY);
    let day = 1000 * 60 * 60 * 24;
    expect(com.getMinStartDate("MONTHLY", startDate)).toEqual(checkStartDateMONTHLY.getTime() + day);
    expect(com.getMinStartDate("YEARLY", startDate)).toEqual(checkStartDateYEARLY.getTime() + day);
    expect(com.getMinStartDate("30 days", startDate)).toEqual(checkStartDate30.getTime() - (29 * day));
    expect(com.getMinStartDate("15 days", startDate)).toEqual(checkStartDate15.getTime() - (14 * day));
    expect(com.getMinStartDate("7 days", startDate)).toEqual(checkStartDate7.getTime() - (6 * day));
  });
});