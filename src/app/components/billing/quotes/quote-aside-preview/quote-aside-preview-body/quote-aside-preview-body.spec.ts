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
import { QuoteAsidePreviewBodyComponent } from './quote-aside-preview-body.component';


describe('QuoteAsidePreviewBodyComponent unit test', () => {
  let component: QuoteAsidePreviewBodyComponent;
  let fixture: ComponentFixture<QuoteAsidePreviewBodyComponent>;

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
        NoopAnimationsModule, QuoteAsidePreviewBodyComponent],
}).compileComponents();

  });
  it('check "getSubTotalServices"', () => {
    const fixture = TestBed.createComponent(QuoteAsidePreviewBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { services: [{ rate: 10, quantity: 2, taxSum: 0, sum: 20 }, { rate: 20, quantity: 2, taxSum: 0, sum: 20 }] };
    expect(com.getSubTotalServices()).toEqual(40);
  });
  it('check "getSubTotalProducts"', () => {
    const fixture = TestBed.createComponent(QuoteAsidePreviewBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { products: [{ sale: 10, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, quantity: 2, taxSum: 0, sum: 20 }] };
    expect(com.getSubTotalProducts()).toEqual(40);
  });
  it('check "getTotalTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsidePreviewBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = {
      services: [{ rate: 10, quantity: 2, taxSum: 11, sum: 20 }, { rate: 20, quantity: 2, taxSum: 22, sum: 20 }],
      products: [{ sale: 10, quantity: 2, taxSum: 0, sum: 20 }, { sale: 20, quantity: 2, taxSum: 0, sum: 20 }]
    };
    expect(com.getTotalTaxes()).toEqual(33);
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(QuoteAsidePreviewBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
  it('check "calculateServiceDiscount"', () => {
    const fixture = TestBed.createComponent(QuoteAsidePreviewBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.quote = { services: [{ discountType: "PERCENT", quantity: 2, rate: 10, item: { rate: 10 } }, { discountType: "FIXED", discountAmount: 100 }] };
    expect(com.calculateServiceDiscount()).toEqual(100);
  });
});