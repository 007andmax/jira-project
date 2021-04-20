import { Component, OnInit, Input } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';

import { BillableProfile } from '../class/billable-profile';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { User } from '../../../users/class/user';
import { TicketsListService } from '../../../tickets/tickets/services/tickets-list.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-billable-item',
  templateUrl: './billable-item.component.html',
  styleUrls: ['./billable-item.component.scss'],
  providers: [TicketsListService]
})
export class BillableItemComponent implements OnInit {
  @Input() item: BillableProfile;
  company: Company;
  salesPerson: User;
  totalSum: number = 0;
  indexNoAvatar: number = 0;
  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];
  constructor(private companiesStateService: CompaniesStateService,
    public ticketsListService: TicketsListService,
    private billableStateService: BillableStateService,
    private leftPanelStateService: LeftPanelStateService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 3);
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.item.id);
    this.salesPerson = this.usersStateService.getAllUsers().find(item => item.id === company.techLeadId);
  }
  ngDocheck() {

  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  getStyleAvatar(user) {
    if (!user) return '';
    if (!user.avatar) {
      return this.listColorNoAvatar[this.indexNoAvatar];
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return this.listColorNoAvatar[this.indexNoAvatar];
    }
  };
  moToBillableTickets() {
    this.billableStateService.setBillableProfile(this.item);
    this.leftPanelStateService.goToState('new-billable-tickets');
  }
}
