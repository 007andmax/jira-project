import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsHeaderComponent } from './tickets-header.component';
import { TicketsFilterComponent } from './tickets-filter/tickets-filter.component';
import { TicketsFilterTagsComponent } from './tickets-filter/tickets-filter-tags/tickets-filter-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TicketsFilterModule } from './tickets-filter/tickets-filter.module';
import { TicketsFilterInfoComponent } from './tickets-filter-info/tickets-filter-info.component';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';

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
        TicketsFilterModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
    exports: [TicketsHeaderComponent]


})
export class TicketsHeaderModule { }
