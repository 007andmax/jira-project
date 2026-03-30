import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';
import { TechUsersComponent } from './tech-users.component';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { TicketsTableItemRequestedByModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';



@NgModule({
    declarations: [TechUsersComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DynamicTooltipModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule
    ],
    exports: [TechUsersComponent]



})
export class TechUsersModule { }
