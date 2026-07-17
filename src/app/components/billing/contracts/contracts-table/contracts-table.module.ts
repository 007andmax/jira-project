import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsTableComponent } from './contracts-table.component';
import { ContractsTableItemComponent } from './contracts-table-item/contracts-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { ContractsFilterStatusModule } from '../contracts-filter/contracts-filter-status/contracts-filter-status.module';
import { ContractsFilterModule } from '../contracts-filter/contracts-filter.module';


@NgModule({
    declarations: [ContractsTableComponent,
        ContractsTableItemComponent,

    ],
    imports: [
        CommonModule,
        NgbModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule,
        InfiniteScrollModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule,
        ContractsFilterModule


    ],
    exports: [ContractsTableComponent]


})
export class ContractsTableModule { }
