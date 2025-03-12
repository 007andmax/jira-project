import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketStateService } from '../../../../ticket-edit-aside/services/ticket-state.service';
import { CompanyUserNote } from './class/company-user-note';
import { UserNoteValidate } from './class/user-note-validate';
import { TicketProfileFormUpdate } from '../../../../ticket-edit-aside/class/ticket-profile-form-update';

@Component({
  selector: 'add-assigned-user-note',
  templateUrl: './add-assigned-user-note.component.html',
  styleUrls: ['./add-assigned-user-note.component.scss'],
  providers: [TicketsListService]
})
export class AddAssignedUserNoteComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  validate: UserNoteValidate = new UserNoteValidate();
  @Input() selectedUsers = [];
  @Input() userList = [];
  @Input() placement = 'top-left';
  @Input() type: string;
  @Input() container: string;
  @Input() compayId: string;
  @Input() toggleModal: boolean = false;
  users = [];
  reqUsers = [];
  currentUsers = [];
  sub: Subscription = new Subscription();
  @Output() hidden = new EventEmitter<any>();
  @Output() onSelected = new EventEmitter<any>();
  @Output() onCloseModal = new EventEmitter<any>();
  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
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
    this.users = JSON.parse(JSON.stringify(this.userList)).map(item => new CompanyUserNote(item));
    this.reqUsers = JSON.parse(JSON.stringify(this.userList)).map(item => new CompanyUserNote(item));
  }
  onKeyUp(event) {
    if (event.target.value.length == 0) this.validate.resetEmail();
    if (event.keyCode === 13) {
      this.validate.checkEmail(event.target.value);
      if (this.validate.getEmail()) {
        let user = new CompanyUserNote();
        user.setIsCustomEmail(true);
        user.setRecipient(event.target.value);
        this.selectedUsers.push(user);
        this.onSelected.emit(this.selectedUsers);
        this.resetInput();
      }
    }
  }
  onExpand() {
    if (this.toggleModal) {
      this.onCloseModal.emit(null);
    } else {
      this.ticketStateService.openModalNote();
    }
  }
  public resetList(data) {
    this.userList = data;
    this.users = JSON.parse(JSON.stringify(this.userList)).map(item => new CompanyUserNote(item));
    this.reqUsers = JSON.parse(JSON.stringify(this.userList)).map(item => new CompanyUserNote(item));
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
    this.selectedUsers.splice(index, 1);
    this.onSelected.emit(this.selectedUsers);
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
    this.resetInput();
  }
  resetInput() {
    this.userCtrl.setValue(null);
    this.userInput.nativeElement.value = '';
    this.users = JSON.parse(JSON.stringify(this.reqUsers)).map(item => new CompanyUserNote(item));
    this.userInput.nativeElement.focus();
  }
  isSelected(data) {
    return this.selectedUsers.find(item => item.id === data.id);
  }

  onSearchUser(event) {
    if (event.target.value.length > 0) {
      this.users = this.reqUsers.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.users = JSON.parse(JSON.stringify(this.reqUsers)).map(item => new CompanyUserNote(item));
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
      this.users = JSON.parse(JSON.stringify(this.reqUsers)).map(item => new CompanyUserNote(item));
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
