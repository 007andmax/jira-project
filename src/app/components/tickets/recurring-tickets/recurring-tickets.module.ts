import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringTicketsComponent } from './recurring-tickets.component';
import { RecurringTicketsHeaderComponent } from './recurring-tickets-header/recurring-tickets-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RecurringTicketsTableComponent } from './recurring-tickets-table/recurring-tickets-table.component';
import { RecurringTicketsEditAsideComponent } from './recurring-tickets-edit-aside/recurring-tickets-edit-aside.component';
import { RecurringTicketsAddAsideComponent } from './recurring-tickets-add-aside/recurring-tickets-add-aside.component';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { DevicesRecurringTicketsComponent } from './devices-recurring-tickets/devices-recurring-tickets.component';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { IntervalComponent } from '../../shared/interval/interval.component';
import { ProductListModule } from '../../shared/product-list/product-list.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ServicesListModule } from '../../shared/services-list/services-list.module';
import { DurationComponent } from '../../shared/duration/duration.component';
import { TagsComponent } from '../../shared/tags/tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsRoutingModule } from './recurring-tickets-routing.module';
import { TechUsersModule } from '../../shared/tech-users/tech-users.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { RecurringTicketsTableAssignedUserComponent } from './recurring-tickets-table/recurring-tickets-table-assigned-user/recurring-tickets-table-assigned-user.component';
import { RecurringTicketsTableAssignedUserMoreComponent } from './recurring-tickets-table/recurring-tickets-table-assigned-user-more/recurring-tickets-table-assigned-user-more.component';
import { AssignedTicketUserModule } from '../tickets/ticket-add-aside/assigned-ticket-user/assigned-ticket-user.module';



@NgModule({
    declarations: [RecurringTicketsComponent,
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
    imports: [
        CommonModule,
        InfiniteScrollModule,
        TextAreaModule,
        MatSelectModule,
        MatChipsModule,
        DatePickerModule,
        ProductListModule,
        FormsModule,
        NumberModule,
        ServicesListModule,
        TechUsersModule,
        NgbModule,
        MatIconModule,
        ReactiveFormsModule,
        RecurringTicketsRoutingModule,
        CompanyDropDownModule,
        AssignedTicketUserModule
    ],



})
export class RecurringTicketsModule { }
