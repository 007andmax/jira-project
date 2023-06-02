import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TitleListType } from '../../tickets-header/class/title-list-type';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'ticket-detail-change-priority',
  templateUrl: './ticket-detail-change-priority.component.html',
  styleUrls: ['./ticket-detail-change-priority.component.scss']
})
export class TicketDetailChangePriorityComponent extends DropDownComponent {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  list: Array<TitleListType> = [new TitleListType('High Priority', 'HIGH'),
  new TitleListType('Medium Priority', 'MEDIUM'),
  new TitleListType('Low Priority', 'LOW')];
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public usersStateService: UsersStateService,
    public ticketsService: TicketsService) {
    super(elRef, companiesStateService);

  }
  ngOnInit() {
    this.class = ['qt-dropdown'];
    this.field = 'title';
    this.isBlockClear = true;
    this.sort = false;
    this.selectedItem = this.list.find(item => item.type == this.ticketProfile.priorityLevel);
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.customerPortalStateService.isCustomerPortal) this.isDisabled = !this.isAddNoteForCustomerUser();
  }
  isAddNoteForCustomerUser() {
    return this.customerPortalStateService.checkEditTicket(this.usersStateService.getCurrentUser(), this.ticketProfile.createdUserId, this.ticketProfile.companyId);
  }
  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.ticketsService.changePriority({
      "ids": [
        this.ticketProfile.id
      ],
      "value": data.type
    }, this.ticketProfile.number).subscribe(res => {

    })
  }
}
