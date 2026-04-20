import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketDetailProfileEditUpdatesProductsComponent } from './ticket-detail-profile-edit-updates-products.component';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { UntypedFormBuilder, FormsModule } from '@angular/forms';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';

describe('TicketDetailProfileEditUpdatesProductsComponent unit test', () => {
  let component: TicketDetailProfileEditUpdatesProductsComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NgbModule,
        ProductListModule,
        DecimalNumberModule,
        NoopAnimationsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        InvoiceFormTicketEditTaxesModule],
    declarations: [TicketDetailProfileEditUpdatesProductsComponent],
    providers: [UntypedFormBuilder]
}).compileComponents();

  });

  it('check "onChangeSaleProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct = new TicketProfileFormProduct();
    com.addProduct();
    com.onChangeSaleProduct(123, 0);
    expect(com.addedProductList[0].item.sale).toEqual(123)
    expect(com.addedProductList[0].item.sale_str).toEqual("123.00")
  });
  it('check "onChangeCostProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct = new TicketProfileFormProduct();
    com.addProduct();
    com.onChangeCostProduct(500, 0);
    expect(com.addedProductList[0].item.cost).toEqual(500)
    expect(com.addedProductList[0].item.cost_str).toEqual("500.00")
  });
  it('check "onTaxesChangeProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct = new TicketProfileFormProduct();
    com.addProduct();
    com.onTaxesChangeProduct([{ id: 1 }], 0);
    expect(com.addedProductList[0].taxes).toEqual([{ id: 1 }])
  });
  it('check "removeProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct = new TicketProfileFormProduct();
    com.addProduct();
    com.addProduct();
    com.removeProduct([0]);
    expect(com.addedProductList.length).toEqual(1)
  });
  it('check "onValidateSaleCostProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct = new TicketProfileFormProduct();
    com.addProduct();
    com.addedProductList[0].valdiateSaleCost = false;
    com.addedProductList[0].item.sale = 200;
    com.addedProductList[0].item.cost = 100;
    com.onValidateSaleCostProduct(0);
    expect(com.addedProductList[0].valdiateSaleCost).toEqual(true)
  });
  it('check "onValidateProducts"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct = new TicketProfileFormProduct();
    com.addProduct();
    com.addedProductList[0].item.sale = 100;
    com.addedProductList[0].item.cost = 200;
    expect(com.onValidateProducts()).toEqual(false)
    expect(com.addedProductList[0].valdiateSaleCost).toEqual(false)
  });
  it('check "getSelectedProducts"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct.item.versionedId = { id: "test" };
    com.addProduct();
    expect(com.getSelectedProducts().length).toEqual(1)
  });
  it('check "onChangeCost"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.product.item = { cost: 0, cost_str: "0" };
    com.onChangeCost(11);
    expect(com.product.item.cost).toEqual(11)
    expect(com.product.item.cost_str).toEqual("11.00")
  });
  it('check "onValidateSaleCost"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.product.item = { versionedId: "test", sale: 100, cost: 50 };
    com.product.valdiateSaleCost = false;
    com.onValidateSaleCost();
    expect(com.product.valdiateSaleCost).toEqual(true)
  });
});