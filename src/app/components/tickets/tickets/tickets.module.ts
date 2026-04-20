import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsComponent } from './tickets.component';

import { TicketsTableComponent } from './tickets-table/tickets-table.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

import { FormsModule } from '@angular/forms';
import { MergeTicketsComponent } from './merge-tickets/merge-tickets.component';



@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    TicketsRoutingModule,
    FormsModule,
    TicketsComponent,
    TicketsTableComponent
],
})
export class TicketsModule { }
