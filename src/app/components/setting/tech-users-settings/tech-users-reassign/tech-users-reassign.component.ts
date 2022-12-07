import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'tech-users-reassign',
  templateUrl: './tech-users-reassign.component.html',
  styleUrls: ['./tech-users-reassign.component.scss']
})
export class TechUsersReassignComponent implements OnInit {
  namesTechUsersList = [];
  techUsersList = [];
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.namesTechUsersList = this.getTechUserList();
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  onSelectTechUser(item) {
    if (item) {


    } else {

    }
  }

}
