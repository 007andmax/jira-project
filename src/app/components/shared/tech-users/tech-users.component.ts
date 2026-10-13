import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { TechUsersStateService } from './services/tech-users-state.service';
import { Subscription } from 'rxjs';
import { RecurringTicketUser } from '../../tickets/recurring-tickets/interfaces/recurring-ticket-user';
import { TechUserItem } from './class/tech-user-item';
import { SINGLE_SELECT, MULTIPLE_SELECT, RECURRING_TICEKTS } from 'src/app/const/users';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { NgbDropdown, NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipComponent } from '../dynamic-tooltip/dynamic-tooltip.component';
import { NgIf, NgClass, NgStyle, NgFor, CommonModule } from '@angular/common';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsTableItemRequestedByComponent } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';

@Component({
  selector: 'app-tech-users',
  templateUrl: './tech-users.component.html',
  styleUrls: ['./tech-users.component.scss'],
  providers: [TicketsListService],
  standalone: true,
  imports: [NgbModule, CommonModule, UserLogoPopoverDirective, DynamicTooltipComponent, TicketsTableItemRequestedByComponent]
})
export class TechUsersComponent implements OnInit, OnDestroy {
  @Input('users')
  set setUsers(value) {
    this.users = JSON.parse(JSON.stringify(value));
    this.usersList = JSON.parse(JSON.stringify(value));
  }
  public usersList: Array<TechUserItem> = [];
  public showSelect = false;
  public selectedUsers = [];
  @Input() container: string;
  @Input() selectedMode: string = MULTIPLE_SELECT;
  @Input() editUsers = [];
  @Input() editMode: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() type: string = RECURRING_TICEKTS;
  @ViewChild('techUsersDd', { static: true }) techUsersDd: NgbDropdown;
  users: Array<TechUserItem> = [];
  sub = new Subscription();
  @Output() usersChange = new EventEmitter();
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  /**
  * Creates an instance of the TechUsersComponent with the injected services
  * @param {techService} TechUsersService Service to work with tech users
  * @param {TechUsersStateService} techState to work with tech users state
  */
  constructor(
    private techState: TechUsersStateService,
    public cd: ChangeDetectorRef,
    public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,
    private elRef: ElementRef,
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    if (this.editMode) {
      this.selectedUsers = [];
      this.usersList.forEach(item => {
        let index = this.editUsers.findIndex(user => user.id === item.id);
        if (index > -1) {
          this.selectedUsers.push(item);
        }
      })
    }
    this.onInitClearState();
    this.checUsersForEdit();
  }
  openDropDown() {
    if (!this.isDisabled) this.techUsersDd.open();
  }
  public resetEditMode() {
    this.selectedUsers = [];
    this.usersList.forEach(item => {
      let index = this.editUsers.findIndex(user => user.id === item.id);
      if (index > -1) {
        this.selectedUsers.push(item);
      }
    })
  }
  public setUsersList(value) {
    this.users = JSON.parse(JSON.stringify(value));
    this.usersList = JSON.parse(JSON.stringify(value));
  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
  public trackById(index, item) {
    return item.id;
  }
  public setEditUsers(editUsers) {
    this.editUsers = editUsers;
    this.selectedUsers = [];
    this.usersList.forEach(item => {
      let index = this.editUsers.findIndex(user => user.id === item.id);
      if (index > -1) {
        this.selectedUsers.push(item);
      }
    })
    this.cd.detectChanges();
  }

  /**
  * Subscribe for edit mode
  */
  public checUsersForEdit() {
    let getUsersFromEdit = this.techState.getUsersFromEdit().subscribe((data: Array<RecurringTicketUser>) => {
      this.selectedUsers = [];
      data.forEach((item) => {
        let index = this.usersList.findIndex(user => user.id === item.id);
        if (index > (-1)) this.selectedUsers.push(this.usersList[index]);

      })
    })

    this.sub.add(getUsersFromEdit);
  }


  /**
  * Subscribe for clear data
  */
  public onInitClearState() {
    let getClearState = this.techState.getClearState().subscribe(() => this.clear());
    this.sub.add(getClearState);
  }


  /**
 * show selecct wrapper
 */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }

  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }

  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) contain no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) contain no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
  onCloseDropDown(data) {
    if (!data) {
      if (this.elRef.nativeElement.querySelector("#search-user")) this.elRef.nativeElement.querySelector("#search-user").value = "";
      this.usersList = JSON.parse(JSON.stringify(this.users));
    }
  }

  isSelected(data) {
    return this.selectedUsers.find(item => item.id === data.id);
  }

  /**
   * stop event
   */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  /**
     * Set selected user
     * @param index index
     */
  public selectUser(index) {
    if (this.selectedMode === SINGLE_SELECT) {
      this.selectedUsers = [this.usersList[index]];
    } else {
      let findIndex = this.selectedUsers.findIndex(item => item.id === this.usersList[index].id);
      if (findIndex > -1) {
        this.selectedUsers.splice(findIndex, 1);
      } else {
        this.selectedUsers.push(this.usersList[index]);
      }
    }
    this.usersChange.emit(this.selectedUsers);
  }

  /**
   * Search user
   * @param event event
   */
  public onSearch(event) {
    this.usersList = this.users.filter(item => (item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()).includes(event.target.value.toLowerCase()));
    this.cd.detectChanges();
  }

  /**
   * Clear data
   */
  private clear() {
    this.showSelect = false;
    this.selectedUsers = [];
    this.usersChange.emit(this.selectedUsers);
  }
  public clearWithOutChanges() {

    this.showSelect = false;
    this.selectedUsers = [];
  }

  public trackByIndex(index, item) {
    return index;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
