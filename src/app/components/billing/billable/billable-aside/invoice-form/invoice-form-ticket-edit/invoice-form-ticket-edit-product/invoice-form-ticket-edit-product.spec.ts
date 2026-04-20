import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceFormTicketEditProductComponent } from './invoice-form-ticket-edit-product.component';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';

describe('InvoiceFormTicketEditProductComponent unit test', () => {
  let component: InvoiceFormTicketEditProductComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NumberModule,
        ToFixedModule,
        MatErrorModule,
        TaxesModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, InvoiceFormTicketEditProductComponent]
}).compileComponents();

  });

  it('check "onTaxesChange"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditProductComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { taxes: [] }
    com.onTaxesChange([
      { name: 'Tax1', rate: 10 },
      { name: 'Tax2', rate: 5 }
    ]);
    expect(com.product.taxes).toEqual([
      { name: 'Tax1', rate: 10 },
      { name: 'Tax2', rate: 5 }]);
  });
  it('check "onValidateSaleCost"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditProductComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = {
      item: { sale: 100, cost: 50 },
    };
    com.onValidateSaleCost();
    expect(com.valdiateSaleCost).toEqual(true);
  });
  it('check "onChangeSale"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditProductComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = {
      item: { sale: 100, cost: 50 },
    };
    com.onChangeSale(150);
    expect(com.product.item.sale).toEqual(150);
  });
});