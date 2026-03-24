import { Component, Input } from '@angular/core';
import { UsersTableCompanyInfoItemComponent } from '../users-table-company-info-item/users-table-company-info-item.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-users-table-company-info-single',
  templateUrl: './users-table-company-info-single.component.html',
  styleUrls: ['./users-table-company-info-single.component.scss'],
  providers: [TicketsListService]
})
export class UsersTableCompanyInfoSingleComponent extends UsersTableCompanyInfoItemComponent {
  @Input() i: number;
  @Input() getStyleNetAvatar: Function;
  @Input() companyContent: any;
  @Input() disableTooltip: boolean;
}
