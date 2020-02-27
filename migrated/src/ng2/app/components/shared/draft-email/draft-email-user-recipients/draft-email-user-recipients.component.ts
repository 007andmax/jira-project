import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { QuoteStateService } from '../../../billing/quotes/quote-create/quote-state.service';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { USER } from 'src/ng2/app/const/users';
import { takeUntil } from 'rxjs/operators';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { User } from '../../../users/class/user';

@Component({
  selector: 'draft-email-user-recipients',
  templateUrl: './draft-email-user-recipients.component.html',
  styleUrls: ['./draft-email-user-recipients.component.css']
})
export class DraftEmailUserRecipientsComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  selectedUsers = [];
  showError = false;
  showErrorClient = false;
  userEmails = [];
  userList = [];
  reqUsersList = [];
  @Input() selectedClient = null;
  @Input() accountType:string = 'CLIENT';
  @Input() usersSelected:Array<User> = [];
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
    console.log("accountType",this.accountType);
console.log("this.selectedClient",this.selectedClient);
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
  private getUsersList() {

    if (this.usersStateService.getAllUsers().length > 0) this.setUserList(this.usersStateService.getAllUsers());
    this.usersStateService.getOnUsers().subscribe((data) => {
      this.setUserList(data);
    })

  }
  private setUserList(data) {
    this.reqUsersList = data.filter(item => ((this.accountType != null) ? item.accountType === this.accountType : true) && ((this.selectedClient !== null) ? (item.accountType ==='TECH' || item.company.id === this.selectedClient.id) : true) && !item.deletedAt && item.primaryEmail !== '').sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
    1 : ((b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase()) ? -1 : 0));
    this.userList = data.filter(item => ((this.accountType != null) ? item.accountType === this.accountType : true) && ((this.selectedClient !== null) ? (item.accountType ==='TECH' || item.company.id === this.selectedClient.id) : true) && !item.deletedAt && item.primaryEmail !== '').sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
    1 : ((b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase()) ? -1 : 0));

    this.usersSelected.forEach(item => {
      if (item.primaryEmail !== '')
      {
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

  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(company): void {

    this.showError = false;
    this.selectedUsers.push(company.primaryEmail);
    this.userEmails.push(company.primaryEmail);
    this.onCompanyEmails.emit(this.userEmails);
    //  this.userInput.nativeElement.blur();
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
    this.userList = this.reqUsersList;

    /*   this.userInput.nativeElement.value = '';
       this.userList = this.requserList;*/
  }

  onSearch(event) {


    this.userList = this.reqUsersList.filter(item => item.primaryEmail.includes(event.target.value));
  }
  onKeyUp(event) {


    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;

      if ((value || '').trim()) {
        this.selectedUsers.push(value.trim());
        this.userList = this.reqUsersList;
      }
      if (input) {
        input.value = '';
      }
      this.userCtrl.setValue(null);

    }

  }
  public trackByIndex(index, item) {
    return index;
  }


}
