import { Component, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DevicesService } from 'src/app/services/devices/devices.service';

@Component({
  selector: 'app-tech-users-list-report',
  templateUrl: './tech-users-list-report.component.html',
  styleUrls: ['./tech-users-list-report.component.scss'],
})
export class TechUsersListReportComponent extends DropDownComponent {
  sub: Subscription = new Subscription();
  @Input() placeholder: string = 'Tech users';

  constructor(
    public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ref: ChangeDetectorRef,
    public devicesService: DevicesService,
    public companiesService: CompaniesService) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, ref);
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
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.setUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
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
