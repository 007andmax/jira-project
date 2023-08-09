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

@NgModule({
    declarations: [
        TicketsFilterComponent,
        TicketsFilterTagsComponent,
        TicketsFilterStatusComponent
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
