import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringTicketsComponent } from './recurring-tickets.component';
import { RecurringTicketsHeaderComponent } from './recurring-tickets-header/recurring-tickets-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RecurringTicketsTableComponent } from './recurring-tickets-table/recurring-tickets-table.component';
import { RecurringTicketsEditAsideComponent } from './recurring-tickets-edit-aside/recurring-tickets-edit-aside.component';
import { RecurringTicketsAddAsideComponent } from './recurring-tickets-add-aside/recurring-tickets-add-aside.component';

import { DevicesRecurringTicketsComponent } from './devices-recurring-tickets/devices-recurring-tickets.component';

import { IntervalComponent } from '../../shared/interval/interval.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DurationComponent } from '../../shared/duration/duration.component';
import { TagsComponent } from '../../shared/tags/tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsRoutingModule } from './recurring-tickets-routing.module';


import { RecurringTicketsTableAssignedUserComponent } from './recurring-tickets-table/recurring-tickets-table-assigned-user/recurring-tickets-table-assigned-user.component';
import { RecurringTicketsTableAssignedUserMoreComponent } from './recurring-tickets-table/recurring-tickets-table-assigned-user-more/recurring-tickets-table-assigned-user-more.component';












@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RecurringTicketsRoutingModule,
    RecurringTicketsComponent,
    RecurringTicketsHeaderComponent,
    RecurringTicketsTableComponent,
    RecurringTicketsEditAsideComponent,
    RecurringTicketsAddAsideComponent,
    DevicesRecurringTicketsComponent,
    IntervalComponent,
    DurationComponent,
    TagsComponent,
    RecurringTicketsTableAssignedUserComponent,
    RecurringTicketsTableAssignedUserMoreComponent
],
})
export class RecurringTicketsModule { }
