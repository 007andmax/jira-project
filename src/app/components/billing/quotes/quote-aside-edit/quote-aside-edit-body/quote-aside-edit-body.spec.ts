import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QuoteEdit } from '../../class/quote-edit';
import { QuoteAsideEditBodyComponent } from './quote-aside-edit-body.component';


describe('QuoteAsideEditBodyComponent unit test', () => {
  let component: QuoteAsideEditBodyComponent;
  let fixture: ComponentFixture<QuoteAsideEditBodyComponent>;

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
      declarations: [QuoteAsideEditBodyComponent
      ],
    }).compileComponents();

  });
  it('check "getQuotePreview"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
    com.quote.services = [{ sum: 100, taxSum: 50 }];
    com.quote.products = [{ sum: 100, taxSum: 50 }];
    expect(com.getQuotePreview().totalAmount).toEqual(300);
  });
  it('check "selectAddress"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
    com.selectAddress(0, { addressWithSuitNumberAndPostalCode: '123 Billing St', locationName: 'Billing Location', id: 1 });
    expect(com.quote.billingAddress).toEqual('123 Billing St');
    expect(com.quote.billTo).toEqual(1);
  });
  it('check "getSubTotalServices"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { services: [{ rate: 10, quantity: 2, taxSum: 0, sum: 20 }, { rate: 20, quantity: 2, taxSum: 0, sum: 20 }] };
    expect(com.getSubTotalServices()).toEqual(60);
  });
  it('check "getSubTotalProducts"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { products: [{ sale: 10, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, quantity: 2, taxSum: 0, sum: 20 }] };
    expect(com.getSubTotalProducts()).toEqual(60);
  });
  it('check "getSubTotal"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = {
      services: [{ rate: 10, quantity: 2, taxSum: 0, sum: 20 }, { rate: 20, quantity: 2, taxSum: 0, sum: 20 }],
      products: [{ sale: 10, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, quantity: 2, taxSum: 0, sum: 20 }]
    };
    expect(com.getSubTotal()).toEqual(120);
  });
  it('check "calculateServiceDiscount"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { services: [{ discountType: "PERCENT", quantity: 2, rate: 10, item: { rate: 10 } }, { discountType: "FIXED", discountAmount: 100 }] };
    expect(com.calculateServiceDiscount()).toEqual(100);
  });
  it('check "getTotalTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = {
      services: [{ rate: 10, quantity: 2, taxSum: 11, sum: 20 }, { rate: 20, quantity: 2, taxSum: 22, sum: 20 }],
      products: [{ rate: 10, quantity: 2, taxSum: 11, sum: 20 }, { rate: 20, quantity: 2, taxSum: 22, sum: 20 }]
    };
    expect(com.getTotalTaxes()).toEqual(66);
  });
  it('check "updateInvoiceData"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
    com.updateInvoiceData({
      note: "12345"
    });
    expect(com.quote.note).toEqual("12345");
  });
  it('check "onChangeQuoteNumber"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { number: '' } as any;
    com.onChangeQuoteNumber("12345");
    expect(com.quote.number).toEqual("12345");
  });
  it('check "selectProduct"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
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
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
    com.onAddService({
      discountType: "PERCENT",
      discountAmount: 10,
    });
    expect(com.quote.services[0].discountAmount).toEqual(10);
  });
  it('check "removeService"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
    com.onAddService({
      discountType: "PERCENT",
      discountAmount: 10,
    });
    com.removeService(0);
    expect(com.quote.services.length).toEqual(0);
  });
  it('check "removeProduct"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = new QuoteEdit();
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
  it('check "getPriceService"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getPriceService({ quantity: 100, rate: 50, item: { rate: 50 }, taxes: [{ rate: 50 }] })).toEqual("5000.00");
  });
  it('check "getTaxPrice"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.service = { item: { sale: 100, quantity: 2, taxes: [{ rate: 10, name: 'Tax1' }] } } as any;
    expect(com.getTaxPrice({ discountType: "FIXED", rate: 10, quantity: 50, discountAmount: 20, taxes: [{ rate: 100 }] })).toEqual(480);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
});