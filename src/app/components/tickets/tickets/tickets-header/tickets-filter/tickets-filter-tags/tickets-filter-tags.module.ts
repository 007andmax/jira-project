import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsFilterTagsComponent } from './tickets-filter-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';

@NgModule({
    declarations: [
        TicketsFilterTagsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        DynamicTooltipModule
    ],
    exports: [TicketsFilterTagsComponent]


})
export class TicketsFilterTagsModule { }
