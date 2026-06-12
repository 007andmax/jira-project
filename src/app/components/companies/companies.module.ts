import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesComponent } from './companies.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesHeaderComponent } from './companies-header/companies-header.component';
import { CompaniesTableComponent } from './companies-table/companies-table.component';
import { CompanyAddAsideComponent } from './company-add-aside/company-add-aside.component';
import { CompanyEditAsideModule } from './company-edit-aside/company-edit-aside.module';

import { CompaniesFilterComponent } from './companies-header/companies-filter/companies-filter.component';

import { NgxMaskModule } from 'ngx-mask';





import { PreviewPhoneMaskModule } from '../shared/preview-phone-mask/preview-phone-mask.module';
import { TicketsTableItemRequestedByModule } from '../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';


import { UsersTableCompanyByModule } from '../users/users-table/users-table-company-by/users-table-company-by.module';

@NgModule({
    declarations: [CompaniesComponent,
        CompaniesHeaderComponent,
        CompaniesTableComponent,
        CompaniesFilterComponent,
    ],
    imports: [
        CommonModule,
        CompaniesRoutingModule,
        InfiniteScrollModule,
        FormsModule,
        NgbModule,
        CompanyEditAsideModule,
        NgxMaskModule.forRoot(),
        PreviewPhoneMaskModule
    ],



})
export class CompaniesModule { }
