import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModule } from 'src/app/pipe/filter/filter.module';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../mat-error/mat-error.module';


@NgModule({
    declarations: [ProductListComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FilterModule,
        DynamicTooltipModule,
        MatErrorModule
    ],
    exports: [ProductListComponent]


})
export class ProductListModule { }
