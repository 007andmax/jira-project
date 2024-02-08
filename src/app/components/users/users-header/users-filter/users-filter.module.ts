import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersFilterComponent } from './users-filter.component';
import { UsersFilterJobTitleComponent } from './users-filter-job-title/users-filter-job-title.component';
import { TicketsFilterCompaniesDropDownModule } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.module';
import { UserDefaultSubscriptionModule } from '../../users-aside/user-default-subscription/user-default-subscription.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [UsersFilterComponent,
        UsersFilterJobTitleComponent
    ],
    imports: [
        CommonModule,
        TicketsFilterCompaniesDropDownModule,
        UserDefaultSubscriptionModule,
        FormsModule,
    ],
    exports: [UsersFilterComponent]


})
export class UsersFilterModule { }
