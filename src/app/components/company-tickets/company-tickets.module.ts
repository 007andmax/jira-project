import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyTicketsComponent } from './company-tickets.component';
import { CompanyTicketsRoutingModule } from './company-tickets-routing.module';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';







@NgModule({
    imports: [
    CommonModule,
    CompanyTicketsRoutingModule,
    InfiniteScrollModule,
    CompanyTicketsComponent
],
})
export class CompanyTicketsModule { }
