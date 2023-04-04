import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';

@Component({
  selector: 'ticket-detail-contact',
  templateUrl: './ticket-detail-contact.component.html',
  styleUrls: ['./ticket-detail-contact.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailContactComponent implements OnInit, OnDestroy {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onShowMore = new EventEmitter<any>();
  toggleContainer: boolean = true;
  sub: Subscription = new Subscription();
  constructor(public ticketsListService: TicketsListService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {

  }
  checkExistUser() {
    return (this.ticketProfile.createdUser) ? this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id) : null;
  }
  getCompanyUser() {
    return this.companiesStateService.getCompanies().find(item => this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id).clientCompanies.some(clientCompany => clientCompany === item.id));
  }
  getPhoneNumbers() {
    return this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id).phoneNumbers;
  }
  getNameCreateUser() {
    return `${this.ticketProfile.createdUser.firstName} ${this.ticketProfile.createdUser.lastName}`
  }
  showMore() {
    this.onShowMore.emit(null);
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
