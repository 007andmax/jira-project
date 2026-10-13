import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileShare } from '../../../class/ticket-profile-share';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketsTableItemRequestedByComponent } from '../../../tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';

@Component({
  standalone: true,
  imports: [CommonModule, NgbModule, UserLogoPopoverDirective, TicketsTableItemRequestedByComponent],
  selector: 'ticket-detail-profile-updates-header-info',
  templateUrl: './ticket-detail-profile-updates-header-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-header-info.component.scss']
})
export class TicketDetailProfileUpdatesHeaderInfoComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Input() otherRecipients: Array<string> = [];
  @Input() shares: Array<TicketProfileShare> = [];
  @Input() date: number = 0;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
  getStyleShareText(i) {
    return `${(12 * i) + 20}px`;
  }
  public getDate() {
    return `${moment(new Date(this.date)).format('DD MMM YYYY')} at ${moment(new Date(this.date)).format('hh:mm A')}`;
  }
  getUserById(id) {
    return this.usersStateService.getAllUsers().find(item => item.id == id);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
