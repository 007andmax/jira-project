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
    expect(com.quote.shippingLocationName).toEqual('Billing Location');
    expect(com.quote.billTo).toEqual(1);
  });
  it('check "getSubTotalServices"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote.services = [{ rate: 10, quantity: 2, taxSum: 0, sum: 20 }, { rate: 20, quantity: 2, taxSum: 0, sum: 20 }];
    expect(com.getSubTotalServices()).toEqual(60);
  });
  it('check "getSubTotalProducts"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote.products = [{ sale: 10, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, quantity: 2, taxSum: 0, sum: 20 }];
    expect(com.getSubTotalProducts()).toEqual(60);
  });
  it('check "getSubTotal"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote.services = [{ rate: 10, quantity: 2, taxSum: 0, sum: 20 }, { rate: 20, quantity: 2, taxSum: 0, sum: 20 }];
    com.quote.products = [{ sale: 10, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, quantity: 2, taxSum: 0, sum: 20 }];
    expect(com.getSubTotal()).toEqual(120);
  });
  it('check "calculateServiceDiscount"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote.services = [{ discountType: "PERCENT", quantity: 2, item: { rate: 10 } }, { discountType: "FIXED", discountAmount: 100 }];
    expect(com.calculateServiceDiscount()).toEqual(120);
  });
  it('check "getTotalTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote.services = [{ rate: 10, quantity: 2, taxSum: 11, sum: 20 }, { rate: 20, quantity: 2, taxSum: 22, sum: 20 }];
    expect(com.getTotalTaxes()).toEqual(33);
  });
  it('check "updateInvoiceData"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateInvoiceData({
      note: "12345"
    });
    expect(com.quote.note).toEqual("12345");
  });
  it('check "onChangeQuoteNumber"', () => {
    const fixture = TestBed.createComponent(QuoteAsideEditBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeQuoteNumber("12345");
    expect(com.quote.number).toEqual("12345");
  });
});