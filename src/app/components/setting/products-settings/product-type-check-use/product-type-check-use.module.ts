import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { ProductTypeCheckUseComponent } from './product-type-check-use.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [ProductTypeCheckUseComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        NgbModule,
    ],
    exports: [ProductTypeCheckUseComponent]
})
export class ProductTypeCheckUseModule { }
