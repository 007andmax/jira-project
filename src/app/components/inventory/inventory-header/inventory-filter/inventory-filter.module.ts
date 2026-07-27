import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { InventoryFilterComponent } from './inventory-filter.component';
import { InventoryAddCategoryComponent } from '../../inventory-add-category/inventory-add-category.component';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [InventoryFilterComponent,
        InventoryAddCategoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        MatErrorModule
    ],
    exports: [InventoryFilterComponent]


})
export class InventoryFilterModule { }
