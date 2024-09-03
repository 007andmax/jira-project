import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsFilterCompaniesDropDownComponent } from './tickets-filter-companies-drop-down.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';

@NgModule({
    declarations: [TicketsFilterCompaniesDropDownComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DynamicTooltipModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
    exports: [TicketsFilterCompaniesDropDownComponent]


})
export class TicketsFilterCompaniesDropDownModule { }
