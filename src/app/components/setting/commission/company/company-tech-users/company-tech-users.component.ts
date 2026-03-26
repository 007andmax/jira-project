import { Component, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TechUsersComponent } from 'src/app/components/shared/tech-users/tech-users.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { SINGLE_SELECT } from 'src/app/const/users';

@Component({
  selector: 'company-tech-users',
  templateUrl: './company-tech-users.component.html',
  styleUrls: ['./company-tech-users.component.scss'],
  providers: [TicketsListService]
})
export class CompanyTechUsersComponent extends TechUsersComponent {
  @ViewChild('dp', { static: true }) dp: NgbDropdown;
  outSelectedUsers = [];
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    if (this.editMode) {
      this.usersList.forEach(item => {
        let index = this.editUsers.findIndex(user => user.id === item.id);
        if (index > -1) {
          item.selected = true;
          this.selectedUsers.push(JSON.parse(JSON.stringify(item)));
        }
      })
      this.outSelectedUsers = this.usersList.filter(item => item.selected);
    }
    this.onInitClearState();
    this.checUsersForEdit();
  }
  public resetEditMode() {
    this.selectedUsers = [];
    this.usersList.forEach(item => {
      let index = this.editUsers.findIndex(user => user.id === item.id);
      if (index > -1) {
        item.selected = true;
        this.selectedUsers.push(JSON.parse(JSON.stringify(item)));
      }
    })
    this.outSelectedUsers = this.usersList.filter(item => item.selected);
  }
  public toggleDropDown(data) {
    if (data) this.dp.open();
    if (!data) this.dp.close();
  }
  public selectUser(index) {
    this.usersList[index].selected = !this.usersList[index].selected;
    if (this.selectedMode === SINGLE_SELECT) {
      this.usersList.forEach((item, i) => {
        if (i !== index) item.selected = false;
      });
    }
    this.outSelectedUsers = this.usersList.filter(item => item.selected);
  }
  public isSelected(user) {
    return this.outSelectedUsers.find(item => item.id == user.id);
  }
  public save() {
    this.usersChange.emit(this.outSelectedUsers);
  }
}
