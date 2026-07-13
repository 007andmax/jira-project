import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsTableComponent } from './contracts-table.component';
import { ContractsTableItemComponent } from './contracts-table-item/contracts-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    declarations: [ContractsTableComponent,
        ContractsTableItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule,
        InfiniteScrollModule

    ],
    exports: [ContractsTableComponent]


})
export class ContractsTableModule { }
