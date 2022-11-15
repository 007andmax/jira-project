import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyTicketsComponent } from './company-tickets.component';
import { CompanyTicketsRoutingModule } from './company-tickets-routing.module';
import { TicketsHeaderModule } from '../tickets/tickets/tickets-header/tickets-header.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketsTableItemModule } from '../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item.module';
import { PreviewAttachmentModule } from '../tickets/tickets/ticket-edit-aside/preview-attachment/preview-attachment.module';



@NgModule({
    declarations: [
        CompanyTicketsComponent
    ],
    imports: [
        CommonModule,
        CompanyTicketsRoutingModule,
        TicketsHeaderModule,
        InfiniteScrollModule,
        TicketsTableItemModule,
        PreviewAttachmentModule

    ],



})
export class CompanyTicketsModule { }
