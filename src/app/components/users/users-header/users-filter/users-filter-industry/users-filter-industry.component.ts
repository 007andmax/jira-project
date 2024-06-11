import { Component } from '@angular/core';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsFilterDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component';

@Component({
  selector: 'app-users-filter-industry',
  templateUrl: './users-filter-industry.component.html',
  styleUrls: ['./users-filter-industry.component.scss'],
  providers: [CompanyTagsListService, TicketsListService]
})
export class UsersFilterIndustryComponent extends TicketsFilterDropDownComponent {


}
