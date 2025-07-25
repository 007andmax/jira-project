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



describe('InvoicesAsideComponent unit test', () => {
  let component: InvoicesAsideComponent;
  let fixture: ComponentFixture<InvoicesAsideComponent>;

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
      declarations: [InvoicesAsideComponent
      ]
    }).compileComponents();

  });

  it('check "onSelectPaymentModes"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectPaymentModes(new CompanySetting('Credit Card', 'CREDIT_CARD'));
    expect(com.payment.paymentMethod).toEqual("CREDIT_CARD");
  });
  it('check "onChangeAmountReceived"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeAmountReceived({ tatget: { value: "100" } })
    expect(com.amountReceived).toEqual(100);
    expect(com.amountReceived_str).toEqual("100.00");
    expect(com.isChangeAmountReceived).toEqual(true);
  });
  it('check "clearAmounts"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [new Invoice({ id: '1', sum: 100, paymentAmount: 0 }),
    new Invoice({ id: '1', sum: 100, paymentAmount: 0 })
    ];
    expect(com.amountReceived).toEqual(0);
    expect(com.amountReceived_str).toEqual("0.00");
  });
  it('check "getUnUsedAmountReceived"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [new Invoice({ id: '1', sum: 100, paymentAmount: 100 }),
    new Invoice({ id: '1', sum: 100, paymentAmount: 500 })
    ];
    com.innvoices[0].selected = true;
    com.innvoices[1].selected = true;
    expect(com.getUnUsedAmountReceived()).toEqual("-600.00");
  });
  it('check "getRemainingBalance"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [new Invoice({ id: '1', totalSum: 100, paidSum: 50 }),
    new Invoice({ id: '1', totalSum: 100, paidSum: 50 })
    ];
    com.innvoices[0].selected = true;
    com.innvoices[1].selected = true;
    expect(com.getRemainingBalance()).toEqual(100);
  });
  it('check "getTotalPayment"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [new Invoice({ id: '1', paymentAmount: 100, paidSum: 50 }),
    new Invoice({ id: '1', paymentAmount: 100, paidSum: 50 })
    ];
    com.innvoices[0].selected = true;
    com.innvoices[1].selected = true;
    expect(com.getTotalPayment()).toEqual(200);
  });
  it('check "checkShowClearAmounts"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [new Invoice({ id: '1', paymentAmount: 100, paidSum: 50 })];
    com.innvoices[0].selected = true;
    expect(com.checkShowClearAmounts().id).toEqual('1');
  });
  it('check "getSubtotal"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [new Invoice({ id: '1', totalSum: 100, paidSum: 50 }),
    new Invoice({ id: '1', totalSum: 100, paidSum: 50 })
    ];
    com.innvoices[0].selected = true;
    com.innvoices[1].selected = true;
    expect(com.getSubtotal()).toEqual(100);
  });
  it('check "close"', () => {
    const fixture = TestBed.createComponent(InvoicesAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.close();
    expect(com.opened).toEqual(false);
    expect(com.invoices.length).toEqual(0);
    expect(com.amountReceived).toEqual(0);
    expect(com.amountReceived_str).toEqual("0.00");
  });
});