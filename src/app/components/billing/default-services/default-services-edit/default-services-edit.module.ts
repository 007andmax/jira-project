import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultServicesEditComponent } from './default-services-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { SelectSearchModule } from 'src/app/components/shared/select-search/select-search.module';

@NgModule({
    declarations: [DefaultServicesEditComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        NumberModule,
        TaxesModule,
        SelectSearchModule
    ],
    exports: [DefaultServicesEditComponent]


})
export class DefaultServicesEditModule { }
