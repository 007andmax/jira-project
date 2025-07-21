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
import { ProductItemQuoteEditComponent } from './product-item-quote-edit.component';


describe('ProductItemQuoteEditComponent unit test', () => {
  let component: ProductItemQuoteEditComponent;
  let fixture: ComponentFixture<ProductItemQuoteEditComponent>;

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
      declarations: [ProductItemQuoteEditComponent
      ],
    }).compileComponents();

  });

  it('check "getTaxPrice"', () => {
    const fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { sale: 100, quantity: 2, taxes: [{ rate: 10, name: 'Tax1' }] } as any;
    expect(com.getTaxPrice()).toEqual(10 / 100 * 100 * 2);
  });
  it('check "changeSales"', () => {
    const fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { sale: 100, quantity: 1, cost: 100 } as any;
    com.changeSales({ target: { value: 200 } });
    expect(com.product.sale).toEqual(200);
    expect(com.product.sale_str).toEqual("200.00");
  });
  it('check "changeCost"', () => {
    const fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { sale: 100, quantity: 1, cost: 100 } as any;
    com.changeCost({ target: { value: 200 } });
    expect(com.product.cost).toEqual(200);
    expect(com.product.cost_str).toEqual("200.00");
  });
  it('check "getMarkups"', () => {
    const fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { sale: 200, quantity: 1, cost: 100 } as any;
    expect(com.getMarkups()).toEqual(100);
  });
  it('check "changeMarkup"', () => {
    const fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { sale: 100, quantity: 1, cost: 100 } as any;
    com.changeMarkup(200);
    expect(com.product.sale).toEqual(300);
    expect(com.product.sale_str).toEqual("300.00");
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(ProductItemQuoteEditComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
});