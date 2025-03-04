import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { ServiceAgreement } from '../../../class/service-agreement';
import { ContractsAsideDiscountModule } from '../../contracts-aside-discount/contracts-aside-discount.module';
import { ContractsAsideProductServiceContractsComponent } from '../../contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';
import { ContractsAsideUserDeviceServiceComponent } from './contracts-aside-user-device-service.component';
import { ContractsUserDeviceService } from '../../class/contracts-user-device-service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsAsideUserDeviceServiceComponent unit test', () => {
  let component: ContractsAsideUserDeviceServiceComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        TaxesModule,
        NumberModule,
        InvoiceFormTicketEditTaxesModule,
        DecimalNumberModule,
        MatErrorModule,
        ContractsAsideDiscountModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [
        ContractsAsideUserDeviceServiceComponent
      ],
    }).compileComponents();

  });

  it('check "service"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsUserDeviceService(150, "test", 100, ["1", "2", "3"], "test-123")
    expect(com.service.getDataForCreate()).toEqual({
      count: 150,
      rate: "100",
      taxIds: ["1", "2", "3"],
      subscriptionService: "test-123",
      discountAmount: undefined,
      discountType: undefined
    });
  });
  it('check "onTaxesChange()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsUserDeviceService(150, "test", 100, ["1", "2", "3"], "test-123")
    com.onTaxesChange([{ id: "1" }, { id: "2" }, { id: "3" }])
    expect(com.service.taxIds).toEqual(["1", "2", "3"]);
  });
  it('check "onChangeDiscount()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsUserDeviceService(150, "test", 100, ["1", "2", "3"], "test-123")
    com.onChangeDiscount({ type: "FIXED" })
    expect(com.service.discountType).toEqual("FIXED");
  });
  it('check "onChangeRate()"', () => {
    const fixture = TestBed.createComponent(ContractsAsideUserDeviceServiceComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = new ContractsUserDeviceService(150, "test", 100, ["1", "2", "3"], "test-123")
    com.onChangeRate("1000")
    expect(com.service.rate).toEqual(1000);
  });
});