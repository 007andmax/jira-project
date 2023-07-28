import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TicketStateService } from '../services/ticket-state.service';
import { TicketsListService } from '../../services/tickets-list.service';


@Component({
  selector: 'app-add-assigned-user',
  templateUrl: './add-assigned-user.component.html',
  styleUrls: ['./add-assigned-user.component.scss'],
  providers: [TicketsListService]
})
export class AddAssignedUserComponent implements OnInit {

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  @Input() selectedUsers = [];
  @Input() userList = [];
  @Input() placement = 'top-left';
  @Input() type: string;
  @Input() container: string;
  users = [];
  reqUsers = [];
  currentUsers = [];
  sub: Subscription = new Subscription();

  @Output() hidden = new EventEmitter<any>();
  @Output() onSelected = new EventEmitter<any>();
  @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('assignedUserDp', { static: true }) assignedUserDp: NgbDropdown;

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {UsersService} userService Service to work with users
   * @param {NgbActiveModal} activeModal Service to work with modal
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  public constructor(
    public usersStateService: UsersStateService,
    public ticketStateService: TicketStateService,
    public elRef: ElementRef,
    public ticketsListService: TicketsListService,
  ) {


  }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.currentUsers = JSON.parse(JSON.stringify(this.selectedUsers));
    this.users = JSON.parse(JSON.stringify(this.userList));
    this.reqUsers = JSON.parse(JSON.stringify(this.userList));
  }

  public resetList(data) {
    this.userList = data;
    this.users = JSON.parse(JSON.stringify(this.userList));
    this.reqUsers = JSON.parse(JSON.stringify(this.userList));
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.classList.contains('toggle-select-user')) return;
    if (!event.target.closest('app-add-assigned-user') && !event.target.closest('.assigne-user-item')) this.hidden.emit(true);
  }

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0 && this.selectedUsers.length > 1 && this.type != "DETAIL-TICKET" || this.type == "DETAIL-TICKET") {
      this.selectedUsers.splice(index, 1);
      this.onSelected.emit(this.selectedUsers);
    }
  }

  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(data): void {
    let find = this.selectedUsers.find(item => item.id === data.id);
    if (!find) {
      this.selectedUsers.push(data);
      this.onSelected.emit(this.selectedUsers);
    }
    this.userInput.nativeElement.blur();
    this.userCtrl.setValue(null);
    this.userInput.nativeElement.value = '';
  }
  isSelected(data) {
    return this.selectedUsers.find(item => item.id === data.id);
  }

  onSearchUser(event) {
    if (event.target.value.length > 0) {
      this.users = this.reqUsers.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.users = JSON.parse(JSON.stringify(this.reqUsers));
    }
  }

  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}`;
    return '';
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  onCloseDropDown(data) {
    if (!data && this.type == 'DETAIL_TICKET_ASSIGNED_USER') {
      this.elRef.nativeElement.querySelector("#search-user").value = "";
      this.users = JSON.parse(JSON.stringify(this.reqUsers));
    }
  }

  /**
   * Close send modal
   */
  public close() {
    this.selectedUsers = [];
    this.users = [];

  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
