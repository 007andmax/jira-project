import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { ContractsFilterStatusComponent } from './contracts-filter-status.component';

@NgModule({
    declarations: [
        ContractsFilterStatusComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        DynamicTooltipModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule
    ],
    exports: [ContractsFilterStatusComponent]


})
export class ContractsFilterStatusModule { }
