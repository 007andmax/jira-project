import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsFilterCompaniesDropDownComponent } from './tickets-filter-companies-drop-down.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [TicketsFilterCompaniesDropDownComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DynamicTooltipModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
    exports: [TicketsFilterCompaniesDropDownComponent]


})
export class TicketsFilterCompaniesDropDownModule { }
