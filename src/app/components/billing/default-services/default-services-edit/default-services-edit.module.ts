import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultServicesEditComponent } from './default-services-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';

@NgModule({
    declarations: [DefaultServicesEditComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        NumberModule,
        TaxesModule,
        DropDownModule
    ],
    exports: [DefaultServicesEditComponent]


})
export class DefaultServicesEditModule { }
