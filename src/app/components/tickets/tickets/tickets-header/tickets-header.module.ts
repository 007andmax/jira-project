import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsHeaderComponent } from './tickets-header.component';
import { TicketsFilterComponent } from './tickets-filter/tickets-filter.component';
import { TicketsFilterTagsComponent } from './tickets-filter/tickets-filter-tags/tickets-filter-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TicketsFilterModule } from './tickets-filter/tickets-filter.module';
import { TicketsFilterInfoComponent } from './tickets-filter-info/tickets-filter-info.component';

@NgModule({
    declarations: [
        TicketsHeaderComponent,
        TicketsFilterInfoComponent
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
        DropDownModule,
        TicketsFilterModule
    ],
    exports: [TicketsHeaderComponent]


})
export class TicketsHeaderModule { }
