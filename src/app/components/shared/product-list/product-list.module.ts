import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { FilterModule } from 'src/app/pipe/filter/filter.module';


@NgModule({
    declarations: [ProductListComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        FilterModule
    ],
    exports: [ProductListComponent]


})
export class ProductListModule { }
