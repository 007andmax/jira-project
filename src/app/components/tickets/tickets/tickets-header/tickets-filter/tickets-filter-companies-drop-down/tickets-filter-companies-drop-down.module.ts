import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsFilterCompaniesDropDownComponent } from './tickets-filter-companies-drop-down.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';

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
    ],
    exports: [TicketsFilterCompaniesDropDownComponent]


})
export class TicketsFilterCompaniesDropDownModule { }
