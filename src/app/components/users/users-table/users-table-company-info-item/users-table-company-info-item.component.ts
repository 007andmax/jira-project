import { Component, Input, OnInit } from '@angular/core';
import { UserCustomerCompaniesInfo } from '../../class/user-customer-companies-info';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-users-table-company-info-item',
  templateUrl: './users-table-company-info-item.component.html',
  styleUrls: ['./users-table-company-info-item.component.scss'],
  providers: [TicketsListService]
})
export class UsersTableCompanyInfoItemComponent implements OnInit {
  @Input() company: UserCustomerCompaniesInfo;
  @Input() getCompany: Function;
  @Input() checkLogo: Function;
  @Input() getStyleAvatarCompany: Function;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,
    public companiesStateService: CompaniesStateService,
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }

}
