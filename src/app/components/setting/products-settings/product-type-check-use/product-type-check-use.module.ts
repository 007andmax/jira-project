import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { ProductTypeCheckUseComponent } from './product-type-check-use.component';


@NgModule({
    declarations: [ProductTypeCheckUseComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,
    ],
    entryComponents: [ProductTypeCheckUseComponent],
    exports: [ProductTypeCheckUseComponent]
})
export class ProductTypeCheckUseModule { }
