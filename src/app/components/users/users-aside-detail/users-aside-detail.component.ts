import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PhoneNumber } from 'src/class/phone-number';
import { StatusColor } from '../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';

import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { User } from '../class/user';
import { UsersAsideDetailTicketsComponent } from './users-aside-detail-tickets/users-aside-detail-tickets.component';

@Component({
  selector: 'users-aside-detail',
  templateUrl: './users-aside-detail.component.html',
  styleUrls: ['./users-aside-detail.component.scss'],
  providers: [TicketsListService]
})
export class UsersAsideDetailComponent implements OnInit {
  user: User;
  open: boolean = false;
  @Output() onClosed = new EventEmitter<any>();
  @ViewChild('ticketsDetail') ticketsDetail: UsersAsideDetailTicketsComponent;
  constructor(public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    private usersService: UsersService,
    private tagsService: TagsService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private ticketsStateService: TicketsStateService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.usersStateService.openDetailAside.subscribe(data => {
      this.user = data;
      console.log("this.user", this.user);
      if (this.user.phoneNumbers && this.user.phoneNumbers.length === 0 || !this.user.phoneNumbers) {
        this.user.phoneNumbers = [new PhoneNumber('OFFICE')];
      } else {
        this.user.phoneNumbers = this.user.phoneNumbers.map((item) => {
          let number = item.number;
          if (number[0] === "1") number = `+${number}`;
          return new PhoneNumber(item.typeNumber, number);
        })
      }
      this.cd.detectChanges();
      if (this.ticketsDetail) {
        this.ticketsDetail.setDefaultScoll();
        this.ticketsDetail.onScroll();
      }
      this.open = true;


    })
    this.leftPanelService.getColors().subscribe((data: any) => {
      let listColors = data.map(item => {
        return new StatusColor(item.backgroundColor, item.borderColor);
      })
      this.ticketsStateService.onColorStatus(listColors);
    })
    this.leftPanelService.getTicketsStatus().subscribe((data: any) => {

      let ticketsColor = new TicketsColor(data);
      this.ticketsStateService.onInitStatus(ticketsColor);
    })
  }
  onChangeTags(data) {
    console.log("onChangeTags", data);
    let ids = data.map(item => {
      return { id: item.id }
    });
    this.tagsService.setTagsUser(this.user.id, ids).subscribe(data => {

    })
  }
  close() {
    this.open = false;
    this.onClosed.emit(null);
  }
  getCompanyName() {
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.user.company.id);
    return (find) ? find.name : '';
  }
  onChangeSubscriptions(data) {
    console.log("onChangeSubscriptions", data);
    let subscription = {
      id: this.user.subscription.id,
      invoice: true,
      ticket: true,
      ticketManager: true,
    }
    data.forEach(item => subscription[item.field] = item.selected);
    this.usersService.setSubscriptions(subscription).subscribe(res => {

    })
  }
}
