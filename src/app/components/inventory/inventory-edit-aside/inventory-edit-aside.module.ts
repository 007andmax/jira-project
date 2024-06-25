import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryEditAsideComponent } from './inventory-edit-aside.component';
import { MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { TaxesModule } from '../../shared/taxes/taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { GlNumbersDropDownModule } from '../gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [InventoryEditAsideComponent
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
        GlNumbersDropDownModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],
    exports: [InventoryEditAsideComponent]



})
export class InventoryEditAsideModule { }
