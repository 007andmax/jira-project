import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsFilterTagsComponent } from './tickets-filter-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [
        TicketsFilterTagsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        DynamicTooltipModule,
        MatChipModule,
        MatFormFieldModule
    ],
    exports: [TicketsFilterTagsComponent]


})
export class TicketsFilterTagsModule { }
