import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { ContractsFilterStatusModule } from './contracts-filter-status/contracts-filter-status.module';
import { ContractsFilterComponent } from './contracts-filter.component';


@NgModule({
    declarations: [ContractsFilterComponent,

    ],
    imports: [
        CommonModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule,
        ContractsFilterStatusModule

    ],
    exports: [ContractsFilterComponent]


})
export class ContractsFilterModule { }
