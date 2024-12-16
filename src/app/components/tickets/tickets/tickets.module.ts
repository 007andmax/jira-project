import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets.component';
import { TicketsHeaderModule } from './tickets-header/tickets-header.module';
import { TicketsTableComponent } from './tickets-table/tickets-table.component';
import { PreviewAttachmentModule } from './ticket-edit-aside/preview-attachment/preview-attachment.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketsTableItemModule } from './tickets-table/tickets-table-item/tickets-table-item.module';
import { TicketsRoutingModule } from './tickets-routing.module';
import { ServicesListModule } from '../../shared/services-list/services-list.module';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketsFilterModule } from './tickets-header/tickets-filter/tickets-filter.module';
import { FormsModule } from '@angular/forms';
import { MergeTicketsComponent } from './merge-tickets/merge-tickets.component';
import { MergeTicketsModule } from './merge-tickets/merge-tickets.module';


@NgModule({
    declarations: [TicketsComponent,
        TicketsTableComponent,


    ],
    imports: [
        CommonModule,
        TicketsHeaderModule,
        PreviewAttachmentModule,
        InfiniteScrollModule,
        TicketsTableItemModule,
        TicketsRoutingModule,
        ServicesListModule,
        TicketsFilterModule,
        FormsModule,
        MergeTicketsModule
    ],



})
export class TicketsModule { }
