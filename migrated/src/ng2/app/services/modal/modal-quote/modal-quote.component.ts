import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { USER } from "../../../const/users";
import { UsersService } from "../../users/users.service";
import { QuoteStateService } from "../../../components/billing/quotes/quote-create/quote-state.service";
import {QuoteService} from "../../quote/quote.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-modal-quote',
  templateUrl: './modal-quote.component.html',
  styleUrls: ['./modal-quote.component.scss']
})
export class ModalQuoteComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  message: string;
  subject: string;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  selectedUsers = [];
  showError = false;
  showErrorClient = false;
  usersEmails = [];
  users = [];
  private unsubscribe: Subject<void> = new Subject();
  @Input() public data;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UsersService,
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService
  ) {
  }

  ngOnInit() {
    console.log('this.data',this.data);
    (this.data) && this.initResendMode();
    this.getAllUsers();
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        this.selectedUsers.push(value.trim());
      }
      if (input) {
        input.value = '';
      }
      this.userCtrl.setValue(null);
    }
  }

  remove(index): void {
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.usersEmails.splice(index, 1);
      this.quoteStateService.setUsersEmail(this.usersEmails);
      // this.isResend && (this.data.recipients = this.usersEmails);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.showError = false;
    this.selectedUsers.push(event.option.viewValue);
    this.usersEmails.push(event.option.value.primaryEmail);
    this.quoteStateService.setUsersEmail(this.usersEmails);
    // this.isResend && (this.data.recipients.push(event.option.value.primaryEmail));
    this.userInput.nativeElement.blur();
    this.userCtrl.setValue(null);
  }

  private getAllUsers() {
    this.showErrorClient = false;
    const company = (this.data && this.data.company.id) || this.quoteStateService.getClient();
    if (company || company.id) {
      this.userService.getAllusers().subscribe((res: any) => {
        const techUser  = res.filter((item) =>  item.accountType === USER.TYPE.TECH && !item.deletedAt);
        let clientUser = [];
        if (typeof company === 'string' || company instanceof String) {
           clientUser = res.filter((item) =>  {
            return item.accountType === USER.TYPE.CLIENT && item.company.id == company && !item.deletedAt
          });
        } else {
          clientUser = res.filter((item) =>  {
            return item.accountType === USER.TYPE.CLIENT && item.company.id == company.id && !item.deletedAt
          });
        }
        this.users = [...techUser, ...clientUser];
      })
    } else {
      this.showErrorClient = true;
    }
  }

  public setSubject(value) {
    this.quoteStateService.setSubject(value);
    this.isResend && (this.data.subject = value);
  }

  public setMessage(value) {
    this.quoteStateService.setMessage(value);
    this.isResend && (this.data.message = value);
  }

  public save() {
    this.showError = false;
    if ((this.data && this.data.recipients.length > 0 && !!this.data.recipients[0]) || (this.usersEmails && this.usersEmails.length > 0)) {
      if (!this.isResend) {
        this.quoteStateService.saveSandMode();
      } else {
        this.quoteService.resend(this.data)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((res) => {
            this.quoteService.repeatSend(res.id).subscribe((res) => {})
            this.unsubscribe.next();
            this.unsubscribe.complete();
        })
      }
      this.activeModal.close();
    } else {
      this.showError = true;
    }

  }

  public initResendMode() {
    this.isResend = true;
    if (this.data.recipients.length === 0) {
    } else {
      if (this.data.recipients.length > 0 && this.data.recipients[0] !== "") {
        this.selectedUsers = [...this.data.recipients];
      } else {
        this.data.recipients = [];
        this.selectedUsers = [...this.data.recipients];
      }
      this.message = this.data.message && this.data.message !== "null" ? this.data.message : '';
      this.subject = this.data.subject && this.data.subject !== "null" ? this.data.subject : '';
    }
  }

  public close() {
    this.selectedUsers = [];
    this.usersEmails = [];
    this.users = [];
    // this.data.recipients = [];
    // this.data = {};
    this.activeModal.dismiss('Cross click');
  }

}
