import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryEditAsideComponent } from './inventory-edit-aside.component';
import { MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SelectSearchModule } from '../../shared/select-search/select-search.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { TaxesModule } from '../../shared/taxes/taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';


@NgModule({
    declarations: [InventoryEditAsideComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        SelectSearchModule,
        TextAreaModule,
        TaxesModule,
        NumberModule,
        DropDownModule
    ],
    exports: [InventoryEditAsideComponent]



})
export class InventoryEditAsideModule { }
