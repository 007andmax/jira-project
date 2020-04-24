import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { QuoteStateService } from 'src/ng2/app/components/billing/quotes/quote-create/quote-state.service';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { NotificationStateService } from 'src/ng2/app/components/shared/notification/services/notification-state.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { SAVE_AND_SEND } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { USER } from 'src/ng2/app/const/users';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-assigned-user',
  templateUrl: './add-assigned-user.component.html',
  styleUrls: ['./add-assigned-user.component.scss']
})
export class AddAssignedUserComponent implements OnInit {

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
 @Input() selectedUsers = [];
  users = [];
  reqUsers = [];
  sub: Subscription = new Subscription();

  @Output() hidden = new EventEmitter<any>();
  @Output() onSelected = new EventEmitter<any>();
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {UsersService} userService Service to work with users
   * @param {NgbActiveModal} activeModal Service to work with modal
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  public constructor(
    private usersStateService: UsersStateService
  ) {


  }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.getAllUsers();
    this.userInput.nativeElement.onblur = (e) => {
      if (this.matAutocomplete.isOpen) {
        let modal = this.matAutocomplete.panel.nativeElement;
        modal.parentNode.style.width = 'max-content';
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    console.log("clickout",event.target);
    if (event.target.classList.contains('add-user')) return;
    if (!event.target.closest('app-add-assigned-user') && !event.target.closest('.assigne-user-item'))   this.hidden.emit(true);
    //  if (event.target.tagName === 'NGB-MODAL-WINDOW' && this.initialized && !this.showConfirm)// this.onCheckChange();
  }



  

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0 && this.selectedUsers.length > 1) {
      this.selectedUsers.splice(index, 1);
      this.onSelected.emit(this.selectedUsers);
      // this.isResend && (this.data.recipients = this.usersEmails);
    }
  }

  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(event: MatAutocompleteSelectedEvent): void {
    let find = this.selectedUsers.find(item => item.id === event.option.value.id);
    if (!find) {
      this.selectedUsers.push(event.option.value);
      this.onSelected.emit(this.selectedUsers);
    } 
    this.userInput.nativeElement.blur();
    this.userCtrl.setValue(null);
    this.userInput.nativeElement.value = '';
  }

  /**
   * Get user list
   */
  private getAllUsers() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    this.users = userList.filter((item) => item.accountType === USER.TYPE.TECH && !item.deletedAt);
    this.reqUsers = userList.filter((item) => item.accountType === USER.TYPE.TECH && !item.deletedAt);
  }

  onSearchUser(event) {
    if (event.target.value.length > 0) {
      console.log("event.target.value", event.target.value);
      this.users = this.reqUsers.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()));
      console.log("users", this.users.length);
    } else {
      this.users = JSON.parse(JSON.stringify(this.reqUsers));
    }
  }

  getAssignedUserNameForAvatar(user) {
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }

  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
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
