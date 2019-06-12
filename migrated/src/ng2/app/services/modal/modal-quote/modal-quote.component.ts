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
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @Input() public data;

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UsersService,
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService
  ) {
    this.getAllUsers();
  }

  ngOnInit() {
    console.log(this.data);
    (this.data) && this.initResendMode();
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
      this.isResend && (this.data.recipients = this.usersEmails);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.showError = false;
    this.selectedUsers.push(event.option.viewValue);
    this.usersEmails.push(event.option.value.primaryEmail);
    this.quoteStateService.setUsersEmail(this.usersEmails);
    this.isResend && (this.data.recipients = this.usersEmails);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  private getAllUsers() {
    this.showErrorClient = false;
    const company = this.quoteStateService.getClient();
    if (company && company.id) {
      this.userService.getAllusers().subscribe((res: any) => {
        const techUser  = res.filter((item) =>  item.accountType === USER.TYPE.TECH && !item.deletedAt);
        const clientUser = res.filter((item) =>  {
          return item.accountType === USER.TYPE.CLIENT && item.company.id == company.id && !item.deletedAt
        });
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
        this.quoteService.resend(this.data).subscribe((res) => {
        })
      }
      this.activeModal.close();
    } else {
      this.showError = true;
    }

  }

  public initResendMode() {
    this.isResend = true;
    this.selectedUsers = this.data.recipients.length > 0 && this.data.recipients[0] !== "" ?  this.data.recipients : [];
    this.message = this.data.message && this.data.message !== "null" ? this.data.message : '';
    this.subject = this.data.subject && this.data.subject !== "null" ? this.data.subject: '';
  }

}
