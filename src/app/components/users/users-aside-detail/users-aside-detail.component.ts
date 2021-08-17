import { Component, Input, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PhoneNumber } from 'src/class/phone-number';

import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { User } from '../class/user';

@Component({
  selector: 'users-aside-detail',
  templateUrl: './users-aside-detail.component.html',
  styleUrls: ['./users-aside-detail.component.scss'],
  providers: [TicketsListService]
})
export class UsersAsideDetailComponent implements OnInit {
  user: User;
  open: boolean = false;
  constructor(public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.usersStateService.openDetailAside.subscribe(data => {
      this.user = data;
      if (this.user.phoneNumbers && this.user.phoneNumbers.length === 0 || !this.user.phoneNumbers) {
        this.user.phoneNumbers = [new PhoneNumber('OFFICE')];
      } else {
        this.user.phoneNumbers = this.user.phoneNumbers.map((item) => {
          let number = item.number;
          if (number[0] === "1") number = `+${number}`;
          return new PhoneNumber(item.typeNumber, number);
        })
      }
      this.open = true;
    })
  }
  close() {
    this.open = false;
  }
  getCompanyName() {
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.user.company.id);
    return (find) ? find.name : '';
  }

}
