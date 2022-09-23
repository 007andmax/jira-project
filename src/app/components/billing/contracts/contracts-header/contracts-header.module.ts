import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContractsHeaderComponent } from './contracts-header.component';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';

@NgModule({
    declarations: [ContractsHeaderComponent,
        ContractsFilterComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule

    ],
    exports: [ContractsHeaderComponent]


})
export class ContractsHeaderModule { }
