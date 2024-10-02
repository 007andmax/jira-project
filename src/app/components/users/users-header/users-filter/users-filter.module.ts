import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersFilterComponent } from './users-filter.component';
import { UsersFilterJobTitleComponent } from './users-filter-job-title/users-filter-job-title.component';
import { TicketsFilterCompaniesDropDownModule } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.module';
import { UserDefaultSubscriptionModule } from '../../users-aside/user-default-subscription/user-default-subscription.module';
import { FormsModule } from '@angular/forms';
import { UsersFilterIndustryComponent } from './users-filter-industry/users-filter-industry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketsFilterTagsModule } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-tags/tickets-filter-tags.module';
import { UsersFilterDefaultSubscriptionComponent } from './users-filter-default-subscription/users-filter-default-subscription.component';
import { UsersFilterTagsComponent } from './users-filter-tags/users-filter-tags.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [UsersFilterComponent,
        UsersFilterJobTitleComponent,
        UsersFilterIndustryComponent,
        UsersFilterDefaultSubscriptionComponent,
        UsersFilterTagsComponent
    ],
    imports: [
        CommonModule,
        TicketsFilterCompaniesDropDownModule,
        UserDefaultSubscriptionModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        MatFormFieldModule,
        InfiniteScrollModule,
        MatChipModule,
        MatChipListModule,
    ],
    exports: [UsersFilterComponent]


})
export class UsersFilterModule { }
