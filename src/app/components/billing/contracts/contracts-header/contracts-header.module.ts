import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContractsHeaderComponent } from './contracts-header.component';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { ContractsFilterStatusModule } from '../contracts-filter/contracts-filter-status/contracts-filter-status.module';

@NgModule({
    declarations: [ContractsHeaderComponent,

    ],
    imports: [
        CommonModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule,
        ContractsFilterStatusModule

    ],
    exports: [ContractsHeaderComponent]


})
export class ContractsHeaderModule { }
