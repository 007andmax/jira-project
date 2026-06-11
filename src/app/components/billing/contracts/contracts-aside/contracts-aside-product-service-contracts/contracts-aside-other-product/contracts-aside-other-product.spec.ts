import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { ContractsAsideOtherProductComponent } from './contracts-aside-other-product.component';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
import { ContractsOtherProduct } from '../../class/contracts-other-product';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ContractsAsideDiscountModule } from '../../contracts-aside-discount/contracts-aside-discount.module';



describe('ContractsAsideOtherProductComponent unit test', () => {
  let component: ContractsAsideOtherProductComponent;
  let fixture: ComponentFixture<ContractsAsideOtherProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        ProductListModule,
        NumberModule,
        FormsModule,
        DecimalNumberModule,
        ToFixedModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule,
        ContractsAsideDiscountModule, ContractsAsideOtherProductComponent],
}).compileComponents();

  });

  it('check "product"', () => {
    const fixture = TestBed.createComponent(ContractsAsideOtherProductComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new ContractsOtherProduct({ id: 500 }, 10, 12, "test");
    com.onChangeProduct(new InventoryItem({
      sale: 100,
      versionedId: { id: 500 },
      description: "description",
      taxes: [{ rate: 1 }, { rate: 2 }, { rate: 3 }]
    }));
    expect(com.product.quantity).toEqual(1);
    expect(com.product.salePrice).toEqual(100);
    expect(com.product.salePrice_str).toEqual("100.00");
    expect(com.product.versionedId).toEqual({ id: 500 });
    expect(com.product.description).toEqual("description");
    com.onChangeProduct(null);
    expect(com.product.quantity).toEqual(0);
    expect(com.product.salePrice).toEqual(0);
    expect(com.product.salePrice_str).toEqual("0.00");
    expect(com.product.versionedId).toEqual(null);
    expect(com.product.description).toEqual(null);
  });
});