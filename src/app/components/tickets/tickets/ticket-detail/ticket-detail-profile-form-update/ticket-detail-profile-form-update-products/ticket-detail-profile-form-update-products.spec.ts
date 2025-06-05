import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update-products.component';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';

describe('TicketDetailProfileFormUpdateProductsComponent unit test', () => {
  let component: TicketDetailProfileFormUpdateProductsComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateProductsComponent>;

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
        InvoiceFormTicketEditTaxesModule
      ],
      declarations: [TicketDetailProfileFormUpdateProductsComponent
      ],
      providers: [FormBuilder]
    }).compileComponents();

  });

  it('check "onChangeSaleProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.onChangeSaleProduct(123, 0);
    expect(com.addedProductList[0].item.sale).toEqual(123)
    expect(com.addedProductList[0].item.sale_str).toEqual("123.00")
  });
  it('check "onChangeCostProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.onChangeCostProduct(500, 0);
    expect(com.addedProductList[0].item.cost).toEqual(500)
    expect(com.addedProductList[0].item.cost_str).toEqual("500.00")
  });
  it('check "onTaxesChangeProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.onTaxesChangeProduct([{ id: 1 }], 0);
    expect(com.addedProductList[0].taxes).toEqual([{ id: 1 }])
  });
  it('check "removeProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.removeProduct([0]);
    expect(com.addedProductList.length).toEqual(1)
  });
  it('check "onValidateSaleCostProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.addedProductList[0].valdiateSaleCost = false;
    com.addedProductList[0].item.sale = 200;
    com.addedProductList[0].item.cost = 100;
    com.onValidateSaleCostProduct(0);
    expect(com.addedProductList[0].valdiateSaleCost).toEqual(true)
  });
  it('check "onValidateProducts"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    com.addedProductList[0].item.sale = 100;
    com.addedProductList[0].item.cost = 200;
    expect(com.onValidateProducts()).toEqual(false)
    expect(com.addedProductList[0].valdiateSaleCost).toEqual(false)
  });
  it('check "onChangeCost"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct.item = { cost: 0, cost_str: "0" };
    com.onChangeCost(11);
    expect(com.currentProduct.item.cost).toEqual(11)
    expect(com.currentProduct.item.cost_str).toEqual("11.00")
  });
  it('check "getSelectedProducts"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct.item.versionedId = { id: "test" };
    com.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(com.currentProduct))));
    expect(com.getSelectedProducts().length).toEqual(2)
  });
  it('check "onChangeSale"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct.item = { versionedId: "test", sale: 100, sale_str: "50" };
    com.onChangeSale(11);
    expect(com.currentProduct.item.sale).toEqual(11)
    expect(com.currentProduct.item.sale_str).toEqual("11.00")
  });
  it('check "onValidateSaleCost"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.currentProduct.item = { versionedId: "test", sale: 100, cost: 50 };
    com.currentProduct.valdiateSaleCost = false;
    com.onValidateSaleCost();
    expect(com.currentProduct.valdiateSaleCost).toEqual(true)
  });
});