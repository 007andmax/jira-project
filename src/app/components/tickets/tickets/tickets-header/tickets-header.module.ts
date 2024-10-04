import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsHeaderComponent } from './tickets-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TicketsFilterModule } from './tickets-filter/tickets-filter.module';
import { TicketsFilterInfoComponent } from './tickets-filter-info/tickets-filter-info.component';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [
        TicketsHeaderComponent,
        TicketsFilterInfoComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
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
