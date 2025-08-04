import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MultiCompanyDropDownModule } from 'src/app/components/shared/multi-company-drop-down/multi-company-drop-down.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { InvoicesAsideComponent } from './invoices-aside.component';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { Invoice } from '../class/invoice';
import { EditPaymentComponent } from './edit-payment.component';



describe('EditPaymentComponent unit test', () => {
  let component: EditPaymentComponent;
  let fixture: ComponentFixture<EditPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        CompanyDropDownModule,
        DropDownModule,
        MultiCompanyDropDownModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [EditPaymentComponent
      ]
    }).compileComponents();

  });


  it('check "onChangeAmountReceived"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeAmountReceived({ target: { value: "100" } })
    expect(com.amountReceived).toEqual(100);
    expect(com.amountReceived_str).toEqual("100.00");
    expect(com.isChangeAmountReceived).toEqual(true);
  });
  it('check "getUnUsedAmountReceived"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.editPayment.paymentData = [{ paidAmount: 10 },
    { paidAmount: 20 }
    ];
    com.amountReceived = 30;
    expect(com.getUnUsedAmountReceived()).toEqual("0.00");
  });
  it('check "onSelectPaymentModes"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPaymentModes(new CompanySetting('Credit Card', 'CREDIT_CARD'));
    expect(com.editPayment.paymentMethod).toEqual("CREDIT_CARD");
  });
  it('check "clearAmounts"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.clearAmounts();
    expect(com.amountReceived).toEqual(0);
    expect(com.amountReceived_str).toEqual("0.00");
  });
  it('check "getSubtotal"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.payment.paymentData = [{ invoicePaidDue: 10 }, { invoicePaidDue: 20 }];
    expect(com.getSubtotal()).toEqual(30);
  });
  it('check "checkShowClearAmounts"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.payment.paymentData = [{ paidAmount: 10 }];
    expect(com.checkShowClearAmounts()).toEqual({ paidAmount: 10 });
  });
  it('check "getTotalPayment"', () => {
    const fixture = TestBed.createComponent(EditPaymentComponent);
    const com = fixture.debugElement.componentInstance;
    com.payment.paymentData = [{ paidAmount: 10 }];
    expect(com.getTotalPayment()).toEqual(10);
  });
});