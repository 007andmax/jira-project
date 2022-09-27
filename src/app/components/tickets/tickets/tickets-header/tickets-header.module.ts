import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsHeaderComponent } from './tickets-header.component';
import { TicketsFilterComponent } from './tickets-filter/tickets-filter.component';
import { SelectSearchModule } from 'src/app/components/shared/select-search/select-search.module';
import { TicketsFilterTagsComponent } from './tickets-filter/tickets-filter-tags/tickets-filter-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';



@NgModule({
    declarations: [
        TicketsHeaderComponent,
        TicketsFilterComponent,
        TicketsFilterTagsComponent
    ],
    imports: [
        CommonModule,
        SelectSearchModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        CompanyDropDownModule
    ],
    exports: [TicketsHeaderComponent]


})
export class TicketsHeaderModule { }
