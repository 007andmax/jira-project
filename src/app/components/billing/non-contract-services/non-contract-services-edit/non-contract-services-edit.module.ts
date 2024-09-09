import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonContractServicesEditComponent } from './non-contract-services-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';

@NgModule({
    declarations: [NonContractServicesEditComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        NumberModule,
        TaxesModule,
        DropDownModule,
        GlNumbersDropDownModule,
        MatErrorModule
    ],
    exports: [NonContractServicesEditComponent]


})
export class NonContractServicesEditModule { }
