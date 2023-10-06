import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, } from '@angular/material';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { User } from '../../../users/class/user';
import { USER } from 'src/app/const/users';

@Component({
  selector: 'draft-email-user-recipients',
  templateUrl: './draft-email-user-recipients.component.html',
  styleUrls: ['./draft-email-user-recipients.component.scss']
})
export class DraftEmailUserRecipientsComponent implements OnInit {
  reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  selectedUsers = [];
  userEmails = [];
  reqUsersList = [];
  toggleAllUsers: boolean = false;
  usersClients = [];
  usersTechnical = [];
  reqUsersListClients = [];
  reqUsersListTechnical = [];
  @Input() validate = true;
  @Input() selectedClient = null;
  @Input() accountType: string = 'CLIENT';
  @Input() usersSelected: Array<User> = [];
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Output() onCompanyEmails = new EventEmitter<any>();
  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {UsersService} userService Service to work with users
   * @param {NgbActiveModal} activeModal Service to work with modal
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  public constructor(

    private draftEmailStateService: DraftEmailStateService,
    private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.getUsersList();
    this.draftEmailStateService.getOnClear().subscribe(data => {
      this.selectedUsers = [];
      this.userEmails = [];
      this.userCtrl.setValue(null);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }

    })
  }
  getFirstLastName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  private getUsersList() {
    if (this.usersStateService.getAllUsers().length > 0) this.setUserList(this.usersStateService.getAllUsers());
    this.usersStateService.getOnUsers().subscribe((data) => {
      this.setUserList(data);
    })
  }
  private setUserList(data) {
    let users = data.filter(item => ((this.selectedClient) ? item.customerCompaniesInfo && item.customerCompaniesInfo.find(company => company.companyId == this.selectedClient.id) : true) &&
      ((this.accountType) ? item.accountType == this.accountType : true) &&
      !item.deletedAt).filter(item => item.primaryEmail !== '').sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
        1 : ((b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase()) ? -1 : 0));
    this.reqUsersListTechnical = users.filter((item) => item.accountType === USER.TYPE.TECH && !item.deletedAt && item.primaryEmail !== "").sort((a, b) => (this.getFirstLastName(a).toLowerCase() > this.getFirstLastName(b).toLowerCase()) ?
      1 : ((this.getFirstLastName(b).toLowerCase() > this.getFirstLastName(a).toLowerCase()) ? -1 : 0));
    this.reqUsersListClients = users.filter((item) => item.accountType === USER.TYPE.CLIENT && !item.deletedAt && item.primaryEmail !== "").sort((a, b) => (this.getFirstLastName(a).toLowerCase() > this.getFirstLastName(b).toLowerCase()) ?
      1 : ((this.getFirstLastName(b).toLowerCase() > this.getFirstLastName(a).toLowerCase()) ? -1 : 0));
    this.usersClients = users.filter((item) => item.accountType === USER.TYPE.CLIENT && !item.deletedAt && item.primaryEmail !== "").sort((a, b) => (this.getFirstLastName(a).toLowerCase() > this.getFirstLastName(b).toLowerCase()) ?
      1 : ((this.getFirstLastName(b).toLowerCase() > this.getFirstLastName(a).toLowerCase()) ? -1 : 0));
    this.usersTechnical = users.filter((item) => item.accountType === USER.TYPE.TECH && !item.deletedAt && item.primaryEmail !== "").sort((a, b) => (this.getFirstLastName(a).toLowerCase() > this.getFirstLastName(b).toLowerCase()) ?
      1 : ((this.getFirstLastName(b).toLowerCase() > this.getFirstLastName(a).toLowerCase()) ? -1 : 0));


    this.reqUsersList = data.filter(item => ((this.selectedClient == null && this.accountType != null) ? item.accountType == this.accountType && !item.deletedAt : false) || ((this.accountType != null) ? item.accountType === this.accountType : true) && ((this.selectedClient !== null) ? (item.accountType === 'TECH' || item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.selectedClient.id)) : true) && !item.deletedAt).filter(item => item.primaryEmail !== '').sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
      1 : ((b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase()) ? -1 : 0));

    this.usersSelected.forEach(item => {
      if (item.primaryEmail !== '') {
        this.selectedUsers.push(item.primaryEmail);
        this.userEmails.push(item.primaryEmail);
      }
    })
    this.onCompanyEmails.emit(this.userEmails);
  }

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {

    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.userEmails.splice(index, 1);
      this.onCompanyEmails.emit(this.userEmails);

    }
  }
  public isSelected(primaryEmail) {
    return this.selectedUsers.find(item => item == primaryEmail);
  }
  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(company): void {
    this.selectedUsers.push(company.primaryEmail);
    this.userEmails.push(company.primaryEmail);
    this.onCompanyEmails.emit(this.userEmails);
    //  this.userInput.nativeElement.blur();
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);

    console.log("this.reqUsersListClients", this.reqUsersListClients);
    this.usersClients = JSON.parse(JSON.stringify(this.reqUsersListClients));
    this.usersTechnical = JSON.parse(JSON.stringify(this.reqUsersListTechnical));
  }

  onSearch(event) {
    this.usersClients = this.reqUsersListClients.filter(item => this.getFirstLastName(item).toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()) || item.primaryEmail.includes(event.target.value.toLocaleLowerCase()));
    this.usersTechnical = this.reqUsersListTechnical.filter(item => this.getFirstLastName(item).toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()) || item.primaryEmail.includes(event.target.value.toLocaleLowerCase()));

  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onAdd(event);
  }

  public onAdd(event) {
    const input = event.target.input;
    const value = event.target.value;
    console.log(value.match(this.reEmail));
    if ((value || '').trim() && value.match(this.reEmail)) {
      this.selectedUsers.push(value.trim());
      this.userEmails.push(value.trim());
      this.onCompanyEmails.emit(this.userEmails);
      console.log("this.reqUsersListClients", this.reqUsersListClients);
      this.usersClients = JSON.parse(JSON.stringify(this.reqUsersListClients));
      this.usersTechnical = JSON.parse(JSON.stringify(this.reqUsersListTechnical));
    }
    if (input) {
      input.value = '';
    }
    this.userCtrl.setValue(null);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
