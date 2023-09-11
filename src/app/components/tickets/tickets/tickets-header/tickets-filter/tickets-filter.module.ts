import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TicketsFilterComponent } from './tickets-filter.component';
import { TicketsFilterTagsComponent } from './tickets-filter-tags/tickets-filter-tags.component';
import { TicketsFilterStatusComponent } from './tickets-filter-status/tickets-filter-status.component';
import { TicketsFilterDropDownComponent } from './tickets-filter-drop-down/tickets-filter-drop-down.component';
import { TicketsFilterCompaniesDropDownComponent } from './tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.component';
import { TicketsFilterSearchComponent } from './tickets-filter-search/tickets-filter-search.component';

@NgModule({
    declarations: [
        TicketsFilterComponent,
        TicketsFilterTagsComponent,
        TicketsFilterStatusComponent,
        TicketsFilterDropDownComponent,
        TicketsFilterCompaniesDropDownComponent,
        TicketsFilterSearchComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        CompanyDropDownModule,
        DropDownModule
    ],
    exports: [TicketsFilterComponent]


})
export class TicketsFilterModule { }
