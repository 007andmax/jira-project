import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryAddAsideComponent } from './inventory-add-aside.component';
import { InventoryAddBodyComponent } from './inventory-add-body/inventory-add-body.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { TaxesModule } from '../../shared/taxes/taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { GlNumbersDropDownModule } from '../gl-numbers-drop-down/gl-numbers-drop-down.module';


@NgModule({
    declarations: [InventoryAddAsideComponent,
        InventoryAddBodyComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        TextAreaModule,
        TaxesModule,
        NumberModule,
        DropDownModule,
        DecimalNumberModule,
        GlNumbersDropDownModule
    ],
    exports: [InventoryAddAsideComponent]



})
export class InventoryAddAsideModule { }
