import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';

@Component({
  selector: 'app-tech-users-list-report',
  templateUrl: './tech-users-list-report.component.html',
  styleUrls: ['./tech-users-list-report.component.scss']
})
export class TechUsersListReportComponent implements OnInit {
  public usersList:any = [];
  public selectedUser = null;
  resUserList = [];
   
  @Output() onChange = new EventEmitter<any>();

  
  constructor(private tehService: TehUsersService) { }

  ngOnInit() {
    this.tehService.getUsersList().subscribe((data: any) => {
      this.resUserList = data.filter(item => {
        if (item.accountType === 'TECH' && !item.deletedAt) {
          item.selected = false;
          return item;
        }
      });
      this.usersList = JSON.parse(JSON.stringify(this.resUserList));

    })
  }
  getSelectedUser() {
    return  (this.selectedUser) ? `${this.selectedUser.firstName} ${this.selectedUser.lastName}` : '';
  }
  onSelect(data) {
    this.selectedUser = data;
   
    this.onChange.emit(data);
  }
  clearClient() {
    
    this.selectedUser = null;
    this.onChange.emit(null);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
