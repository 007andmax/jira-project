import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatAutocomplete } from '@angular/material';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';


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
  @Input() userList = [];
  @Input() placement = 'top-left';

  users = [];
  reqUsers = [];
  currentUsers = [];
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
    this.currentUsers = JSON.parse(JSON.stringify(this.selectedUsers));
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
    if (index >= 0 && this.selectedUsers.length > 1) {
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

  onSearchUser(event) {
    if (event.target.value.length > 0) {
      this.users = this.reqUsers.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()));
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
