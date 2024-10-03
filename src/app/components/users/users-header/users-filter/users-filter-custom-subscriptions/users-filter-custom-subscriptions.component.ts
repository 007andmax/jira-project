import { Component, OnInit } from '@angular/core';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsFilterDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component';

@Component({
  selector: 'app-users-filter-custom-subscriptions',
  templateUrl: './users-filter-custom-subscriptions.component.html',
  styleUrls: ['./users-filter-custom-subscriptions.component.scss'],
  providers: [CompanyTagsListService, TicketsListService]
})
export class UsersFilterCustomSubscriptionsComponent extends TicketsFilterDropDownComponent {



}
