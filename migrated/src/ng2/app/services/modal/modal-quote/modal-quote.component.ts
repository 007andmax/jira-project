import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {USER} from "../../../const/users";
import {UsersService} from "../../users/users.service";
import {QuoteStateService} from "../../../components/billing/quotes/quote-create/quote-state.service";

@Component({
  selector: 'app-modal-quote',
  templateUrl: './modal-quote.component.html',
  styleUrls: ['./modal-quote.component.scss']
})
export class ModalQuoteComponent {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  message: string;
  subject: string;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  selectedUsers = [];
  usersEmails = [];
  users = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UsersService,
    private quoteStateService: QuoteStateService
  ) {
    this.getAllUsers();

  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        console.log(value, 'value');
        this.selectedUsers.push(value.trim());
      }

      // Reset the input value
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
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event, 'EVENT');
    this.selectedUsers.push(event.option.viewValue);
    this.usersEmails.push(event.option.value.primaryEmail);
    this.quoteStateService.setUsersEmail(this.usersEmails);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  private getAllUsers() {
    const companyId = this.quoteStateService.getClient();
    this.userService.getAllusers().subscribe((res: any) => {
      const techUser = res = res.filter((item) =>  item.accountType === USER.TYPE.TECH && !item.deletedAt);
      const clientUser = res = res.filter((item) =>  item.company.id == companyId &&  !item.deletedAt);
      this.users = [...techUser, ...clientUser];
    })
  }

  public setSubject(value) {
    this.quoteStateService.setSubject(value);
  }

  public setMessage(value) {
    console.log(value, 'setMessage');
    this.quoteStateService.setMessage(value);
  }

  public save() {
    this.quoteStateService.saveSandMode();
    this.activeModal.close();
  }

}
