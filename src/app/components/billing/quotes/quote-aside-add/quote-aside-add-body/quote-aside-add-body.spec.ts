import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QuoteAsideAddBodyComponent } from './quote-aside-add-body.component';



describe('QuoteAsideAddBodyComponent unit test', () => {
  let component: QuoteAsideAddBodyComponent;
  let fixture: ComponentFixture<QuoteAsideAddBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [QuoteAsideAddBodyComponent
      ],
    }).compileComponents();

  });

  it('check "onChangeQuoteNumber"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeQuoteNumber("12345");
    expect(com.quote.number).toEqual("12345");
  });
  it('check "onCheckUpdateGlobalNote"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.termsAndConditions = "Terms and conditions updated";
    com.onCheckUpdateGlobalNote();
    expect(com.changeGlobalNote).toEqual(true);
  });
  it('check "getSubTotalServices"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { services: [{ item: { rate: 10 }, quantity: 2, taxSum: 0, sum: 20 }, { item: { rate: 20 }, quantity: 2, taxSum: 0, sum: 20 }] };
    expect(com.getSubTotalServices()).toEqual(60);
  });
  it('check "getSubTotalProducts"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { products: [{ item: { sale: 10 }, quantity: 2, taxSum: 0, sum: 20 }, { item: { sale: 20 }, quantity: 2, taxSum: 0, sum: 20 }] };
    expect(com.getSubTotalProducts()).toEqual(60);
  });
  it('check "getSubTotal"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = {
      services: [{ rate: 10, item: { rate: 10 }, quantity: 2, taxSum: 0, sum: 20 }, { rate: 20, item: { rate: 10 }, quantity: 2, taxSum: 0, sum: 20 }],
      products: [{ sale: 10, item: { rate: 10, sale: 10 }, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, item: { rate: 10, sale: 10 }, quantity: 2, taxSum: 0, sum: 20 }]
    };
    expect(com.getSubTotal()).toEqual(80);
  });
  it('check "calculateServiceDiscount"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { services: [{ discountType: "PERCENT", quantity: 2, item: { rate: 10 } }, { discountType: "FIXED", discountAmount: 100 }] };
    expect(com.calculateServiceDiscount()).toEqual(100);
  });
  it('check "getTotalTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = {
      services: [{ rate: 10, quantity: 2, taxSum: 11, sum: 20 }, { rate: 20, quantity: 2, taxSum: 22, sum: 20 }],
      products: [{ rate: 10, quantity: 2, taxSum: 11, sum: 20 }, { rate: 20, quantity: 2, taxSum: 22, sum: 20 }]
    };
    expect(com.getTotalTaxes()).toEqual(66);
  });
  it('check "updateInvoiceData"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateInvoiceData({
      note: "12345"
    });
    expect(com.quote.note).toEqual("12345");
  });
  it('check "selectProduct"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectProduct({
      id: "12345",
      name: "Test Product",
      sale: 100,
      taxSum: 10,
      sum: 110
    });
    expect(com.quote.products[0].discountType).toEqual("PERCENT");
  });
  it('check "onAddService"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.onAddService({
      discountType: "PERCENT",
      discountAmount: 10,
    });
    expect(com.quote.services[0].discountAmount).toEqual(10);
  });
  it('check "removeService"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.onAddService({
      discountType: "PERCENT",
      discountAmount: 10,
    });
    com.removeService(0);
    expect(com.quote.services.length).toEqual(0);
  });
  it('check "removeProduct"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectProduct({
      id: "12345",
      name: "Test Product",
      sale: 100,
      taxSum: 10,
      sum: 110
    });
    com.removeProduct(0);
    expect(com.quote.products.length).toEqual(0);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsideAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
});