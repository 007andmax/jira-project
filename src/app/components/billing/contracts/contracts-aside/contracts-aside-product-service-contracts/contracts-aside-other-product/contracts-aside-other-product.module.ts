import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideOtherProductComponent } from './contracts-aside-other-product.component';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [ContractsAsideOtherProductComponent
    ],
    imports: [
        CommonModule,
        ProductListModule,
        NumberModule,
        FormsModule

    ],
    exports: [ContractsAsideOtherProductComponent]


})
export class ContractsAsideOtherProductModule { }
