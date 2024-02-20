import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-users-filter-tags',
  templateUrl: './users-filter-tags.component.html',
  styleUrls: ['./users-filter-tags.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterTagsComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';


}
