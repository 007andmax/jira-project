import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';
import { TehUsersSateService } from './services/teh-users-sate.service';
import { Subscription } from 'rxjs';
import { RecurringTicketUser } from '../../tickets/recurring-tickets/interfaces/recurring-ticket-user';
import { TechUserItem } from './class/tech-user-item';
import { SINGLE_SELECT, MULTIPLE_SELECT, RECURRING_TICEKTS } from 'src/ng2/app/const/users';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-teh-users',
  templateUrl: './teh-users.component.html',
  styleUrls: ['./teh-users.component.scss'],
  providers: [TicketsListService]
})
export class TehUsersComponent implements OnInit, OnDestroy {
  @Input('users')
  set setUsers(value) {
    this.users = value;
    this.usersList = value;
  }
  public usersList: Array<TechUserItem> = [];
  public showSelect = false;
  public selectedUsers = [];
  @Input() selectedMode: string = MULTIPLE_SELECT;
  @Input() editUsers = [];
  @Input() editMode: boolean = false;
  @Input() type: string = RECURRING_TICEKTS;
  users: Array<TechUserItem> = [];
  sub = new Subscription();

  @Output() usersChange = new EventEmitter();

  /**
  * Creates an instance of the TehUsersComponent with the injected services
  * @param {tehService} TehUsersService Service to work with teh users
  * @param {TehUsersSateService} tehState to work with teh users state
  */
  constructor(private tehService: TehUsersService,
    private tehState: TehUsersSateService,
    public ticketsListService:TicketsListService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.editMode) {
      this.usersList.forEach(item => {
        let index = this.editUsers.findIndex(user => user.id === item.id);
        if (index > -1) {
          item.selected = true;
          this.selectedUsers = [item];
        } 
      })
    }
    console.log("this.editUsers",this.editUsers);
    console.log("this.usersList",this.usersList);
    this.onInitClearState();
    this.checUsersForEdit();
  }

  /**
  * Subscribe for edit mode
  */
  private checUsersForEdit() {
    let getUsersFromEdit = this.tehState.getUsersFromEdit().subscribe((data: Array<RecurringTicketUser>) => {

      data.forEach((item) => {
        let index = this.usersList.findIndex(user => user.id === item.id);
        if (index > (-1)) this.usersList[index].selected = true;

      })
    })

    this.sub.add(getUsersFromEdit);
  }


  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.tehState.getClearState().subscribe(() => this.clear());
    this.sub.add(getClearState);
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

  /**
     * Set selected user
     * @param index index
     */
  public selectUser(index) {
    this.usersList[index].selected = !this.usersList[index].selected;
    if (this.selectedMode === SINGLE_SELECT) {
      this.usersList.forEach((item, i) => {
        if (i !== index) item.selected = false;
      });
    }
    this.selectedUsers = this.usersList.filter(item => item.selected);
    this.usersChange.emit(this.selectedUsers);
  }

  /**
   * Search user
   * @param event event
   */
  public onSearch(event) {
    this.usersList = this.users.filter(item => (item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()).includes(event.target.value.toLowerCase()));
  }

  /**
   * Clear data
   */
  private clear() {
    this.showSelect = false;
    this.selectedUsers = [];
    this.usersList.forEach((item) => item.selected = false);
    this.usersChange.emit(this.selectedUsers);
  }

  public trackByIndex(index, item) {
    return index;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
