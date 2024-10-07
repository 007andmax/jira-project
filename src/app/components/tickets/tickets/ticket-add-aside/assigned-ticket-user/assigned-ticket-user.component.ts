import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TicketsListService } from '../../services/tickets-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DevicesService } from 'src/app/services/devices/devices.service';

@Component({
  selector: 'app-assigned-ticket-user',
  templateUrl: './assigned-ticket-user.component.html',
  styleUrls: ['./assigned-ticket-user.component.scss'],
  providers: [TicketsListService]
})
export class AssignedTicketUserComponent extends DropDownComponent {
  searchText: string = '';
  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
  @Input() type: string;
  @Input() selectedUsers = [];
  @Output() usersChange = new EventEmitter<any>();
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesService: CompaniesService,
    public devicesService: DevicesService,
    public ref: ChangeDetectorRef,
    public ticketsListService: TicketsListService,) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, ref);
  }
  ngDoCheck() {
    if (this.sort) this.list.sort((a, b) => this.getUserName(a).localeCompare(this.getUserName(b)));
    if (this.reqList.length === 0) this.reqList = JSON.parse(JSON.stringify(this.list));
    if (this.editItem) this.selectedItem = (this.field) ? this.editItem : this.editItem;
  }
  public reset(data) {
    this.list = data;
    if (this.sort) this.list.sort((a, b) => this.getUserName(a).localeCompare(this.getUserName(b)));
    this.reqList = JSON.parse(JSON.stringify(this.list));
    this.ref.markForCheck();
  }
  public selectItemsWithOutChanges(data) {
    this.isAdd = false;
    this.selectedUsers = data;
    this.ref.markForCheck();
  }
  public selected(user): void {
    // user.selected = !user.selected;
    let index = this.selectedUsers.findIndex(item => item.id == user.id);
    if (index > -1) this.selectedUsers.splice(index, 1);
    if (index == -1) this.selectedUsers.push(user);
    // this.selectedUsers = this.list.filter(item => item.selected);
    this.usersChange.emit(this.selectedUsers);
  }
  public clearSearch() {
    this.searchText = '';
    this.userInput.nativeElement.value = "";
    this.list = JSON.parse(JSON.stringify(this.reqList));
  }
  onSearchUser(event) {
    this.searchText = event.target.value;
    if (event.target.value.length > 0) {
      this.list = this.reqList.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.list = JSON.parse(JSON.stringify(this.reqList));
    }
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  public trackByIndex(index, item) {
    return index;
  }
}
