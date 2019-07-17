import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';

@Component({
  selector: 'app-teh-users',
  templateUrl: './teh-users.component.html',
  styleUrls: ['./teh-users.component.scss']
})
export class TehUsersComponent implements OnInit {
  public usersList = [];
  public showSelect = false;
  public selectedUsers = [];
  resUserList = [];
  @Output() usersChange = new EventEmitter();
  constructor(private tehService:TehUsersService) { }

  ngOnInit() {
    this.tehService.getUsersList().subscribe((data:any) => {
this.resUserList = data.filter(item => item.accountType === 'TECH' && !item.deletedAt);;
      this.usersList = data.filter(item => item.accountType === 'TECH' && !item.deletedAt);
      console.log('usersList',this.usersList);
    })
  }

    /**
   * show selecct wrapper
   */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }
 
  /**
   * stop event
   */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  public trackByIndex(index, item) {
    return index;
  }

  public selectUser (index) {
this.selectedUsers.push(this.usersList[index]);
this.usersChange.emit(this.selectedUsers);
  }

  public onSearch (event) {
   
    this.usersList =  this.resUserList.filter(item => (item.firstName+' '+item.lastName).includes(event.target.value));
   
  }
}
