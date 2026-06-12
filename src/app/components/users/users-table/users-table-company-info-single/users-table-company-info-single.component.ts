import { Component, Input } from '@angular/core';
import { UsersTableCompanyInfoItemComponent } from '../users-table-company-info-item/users-table-company-info-item.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { UsersTableCompanyByComponent } from '../users-table-company-by/users-table-company-by.component';

@Component({
  selector: 'app-users-table-company-info-single',
  templateUrl: './users-table-company-info-single.component.html',
  styleUrls: ['./users-table-company-info-single.component.scss'],
  providers: [TicketsListService],
  imports: [UsersTableCompanyByComponent]
})
export class UsersTableCompanyInfoSingleComponent extends UsersTableCompanyInfoItemComponent {
  @Input() i: number = 0;
  @Input() getStyleNetAvatar: Function;
  @Input() companyContent: any;
  @Input() disableTooltip: boolean;
}
