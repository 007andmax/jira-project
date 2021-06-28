import { Component, OnInit, Output, EventEmitter, OnDestroy, ElementRef, Input } from '@angular/core';
import { TehUsersService } from 'src/app/services/teh-users/teh-users.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';

@Component({
  selector: 'app-tech-users-list-report',
  templateUrl: './tech-users-list-report.component.html',
  styleUrls: ['./tech-users-list-report.component.scss']
})
export class TechUsersListReportComponent extends DropDownComponent {
  sub: Subscription = new Subscription();
  @Input() placeholder: string = 'Tech users';

  constructor(private tehService: TehUsersService,
    public elRef: ElementRef,
    private usersStateService: UsersStateService) {
    super(elRef);
  }

  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.usersStateService.getAllUsers().length > 0) {
      this.setUsers(this.usersStateService.getAllUsers());
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.setUsers(data);
    })
    this.sub.add(getOnUsers);
  }
  ngDoCheck() {

    if (this.reqList.length === 0) this.reqList = JSON.parse(JSON.stringify(this.list));
    if (this.editItem) this.selectedItem = (this.field) ? this.editItem : this.editItem;
  }
  setUsers(data) {
    this.reqList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        item.selected = false;
        return item;
      }
    });
    if (this.sort) this.reqList.sort((a, b) => (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`));
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()))
    let index = this.list.findIndex(item => (`${item.firstName} ${item.lastName}`) === event.target.value);
    if (index === -1 && this.add) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }

  getSelectedUser() {
    return (this.selectedItem) ? `${this.selectedItem.firstName} ${this.selectedItem.lastName}` : '';
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public trackByIndex(index, item) {
    return index;
  }
}
