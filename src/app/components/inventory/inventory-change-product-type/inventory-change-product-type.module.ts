import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { FormsModule } from '@angular/forms';
import { InventoryChangeProductTypeComponent } from './inventory-change-product-type.component';


@NgModule({
    declarations: [InventoryChangeProductTypeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        NgbModule,
    ],
    entryComponents: [InventoryChangeProductTypeComponent],
    exports: [InventoryChangeProductTypeComponent]
})
export class InventoryChangeProductTypeModule { }
