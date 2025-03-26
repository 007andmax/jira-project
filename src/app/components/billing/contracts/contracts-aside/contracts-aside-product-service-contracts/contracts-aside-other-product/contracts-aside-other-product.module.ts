import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideOtherProductComponent } from './contracts-aside-other-product.component';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { FormsModule } from '@angular/forms';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { ContractsAsideDiscountModule } from '../../contracts-aside-discount/contracts-aside-discount.module';


@NgModule({
    declarations: [ContractsAsideOtherProductComponent
    ],
    imports: [
        CommonModule,
        ProductListModule,
        NumberModule,
        FormsModule,
        DecimalNumberModule,
        ToFixedModule,
        ContractsAsideDiscountModule

    ],
    exports: [ContractsAsideOtherProductComponent]


})
export class ContractsAsideOtherProductModule { }
