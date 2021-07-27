import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgbActiveModal, NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { USER } from "../../../const/users";
import { Subject, Subscription } from "rxjs";
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { SAVE_AND_SEND } from 'src/app/const/confirm';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QUOTE_MODAL_ACTION_ADD, QUOTE_MODAL_ACTION_EDIT, QUOTE_MODAL_ACTION_LIST, QUOTE_MODAL_ACTION_PREVIEW } from 'src/app/const/quote';
import { SUPPORT_MODAL_ACTION_SEND } from 'src/app/const/support';
import { SupportStateService } from 'src/app/states/support/support-state.service';
import { QuoteEdit } from 'src/app/components/billing/quotes/class/quote-edit';

/**
 * Modal quote component
 */
@Component({
  selector: 'app-modal-quote',
  templateUrl: './modal-quote.component.html',
  styleUrls: ['./modal-quote.component.scss'],
  providers: [NgbModalConfig, NgbModal]

})
export class ModalQuoteComponent implements OnInit, OnDestroy {


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  message: string;
  subject: string;
  focus = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  selectedUsers = [];
  showError = false;
  usersEmails = [];
  users = [];
  reqUsersList = [];
  initialized: boolean = false;
  showConfirm: boolean = false;
  sub: Subscription = new Subscription();
  isChange: boolean = false;


  private unsubscribe: Subject<void> = new Subject();
  @Input() public data;
  @Input() public action;

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
    public activeModal: NgbActiveModal,
    private quoteStateService: QuoteStateService,
    private confirmStateService: ConfirmStateService,
    private supportStateService: SupportStateService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private usersStateService: UsersStateService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

  }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.initResendMode();
    this.getAllUsers((this.data instanceof QuoteEdit) ? this.data.company.id : this.data.companyId);
    this.userInput.nativeElement.onblur = (e) => {
      if (this.matAutocomplete.isOpen) {
        let modal = this.matAutocomplete.panel.nativeElement;
        modal.parentNode.style.width = 'max-content';
      }
    }
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) this.close();
      this.showConfirm = false;
    })
    this.sub.add(getConfirm);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.tagName === 'NGB-MODAL-WINDOW' && this.initialized && !this.showConfirm) this.onCheckChange();
  }

  private onCheckChange() {
    this.isChange = false;
    if (this.data) {
      this.selectedUsers.forEach((current) => {
        let index: number = this.data.recipients.findIndex(old => old === current);
        if (index === -1) this.isChange = true;
      })
      if (this.subject !== this.data.subject || this.message !== this.data.message || this.selectedUsers.length !== this.data.recipients.length) this.isChange = true;

    } else {
      if (this.subject.length > 0 || this.message.length > 0 || this.selectedUsers.length > 0) this.isChange = true;
    }
    if (this.isChange) {
      this.showConfirm = true;
      this.confirmStateService.setConfirmAction(SAVE_AND_SEND);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });

      modalRef.componentInstance.message = 'Do you want to close this window? All entered information will be lost.';
    }
  }

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.usersEmails.splice(index, 1);
      this.quoteStateService.setUsersEmail(this.usersEmails);
    }
  }

  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(event: MatAutocompleteSelectedEvent): void {
    this.showError = false;
    this.selectedUsers.push(event.option.viewValue);
    this.usersEmails.push(event.option.value.primaryEmail);
    this.quoteStateService.setUsersEmail(this.usersEmails);
    // this.userInput.nativeElement.blur();
    this.userCtrl.setValue(null);
    this.userInput.nativeElement.value = '';
  }

  /**
   * Get user list
   */
  private getAllUsers(companyId) {
    let userList = this.usersStateService.getAllUsers();
    this.initialized = true;
    const techUser = userList.filter((item) => item.accountType === USER.TYPE.TECH && !item.deletedAt && item.primaryEmail !== "");
    let clientUser = userList.filter((item) => item.accountType === USER.TYPE.CLIENT && item.company.id == companyId && !item.deletedAt && item.primaryEmail !== "");
    this.users = [...techUser, ...clientUser].sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
      1 : ((b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase()) ? -1 : 0));
    this.reqUsersList = [...techUser, ...clientUser].sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
      1 : ((b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase()) ? -1 : 0));
  }

  /**
   * Set subject
   * @param subject - subject email value
   */
  public setSubject(value) {
    this.subject = value;
  }

  /**
   * Set message
   * @param value - email massage
   */
  public setMessage(value) {
    this.message = value;
  }

  private onInitSubjectAndMessage() {
    this.data.message = this.message;
    this.data.subject = this.subject;
  }

  public onCheckForClose() {
    this.onCheckChange();
    if (!this.isChange) this.close();
  }

  /**
   * Save quote
   */
  public save() {
    this.showError = false;
    if ((this.data && this.data.recipients.length > 0 && !!this.data.recipients[0]) || (this.usersEmails && this.usersEmails.length > 0)) {
      this.onInitSubjectAndMessage();
      this.data.recipients = this.usersEmails;
      if (this.action === QUOTE_MODAL_ACTION_PREVIEW) this.quoteStateService.saveSandModePreview(this.data);
      if (this.action === QUOTE_MODAL_ACTION_EDIT) this.quoteStateService.saveSandModeEdit(this.data);
      if (this.action === QUOTE_MODAL_ACTION_ADD) this.quoteStateService.saveSandMode(this.data);
      if (this.action === QUOTE_MODAL_ACTION_LIST) this.quoteStateService.saveSandModeList(this.data);
      if (this.action === SUPPORT_MODAL_ACTION_SEND) this.supportStateService.onHandleSendMode(this.data);
      this.activeModal.close();
    } else {
      this.showError = true;
    }
  }

  onSearch(event) {
    this.users = this.reqUsersList.filter(item => item.primaryEmail.includes(event.target.value));
  }

  /**
   * Init resend mode
   */
  public initResendMode() {

    if (this.data.recipients && this.data.recipients.length > 0 && this.data.recipients[0] !== "") {
      this.selectedUsers = JSON.parse(JSON.stringify([...this.data.recipients]));
      this.usersEmails = JSON.parse(JSON.stringify([...this.data.recipients]));
    } else {
      this.data.recipients = [];
      this.selectedUsers = JSON.parse(JSON.stringify([...this.data.recipients]));
    }
    this.message = this.data.message && this.data.message !== "null" ? JSON.parse(JSON.stringify(this.data.message)) : '';
    this.subject = this.data.subject && this.data.subject !== "null" ? JSON.parse(JSON.stringify(this.data.subject)) : '';
  }

  /**
   * Close send modal
   */
  public close() {
    this.selectedUsers = [];
    this.usersEmails = [];
    this.users = [];
    this.activeModal.dismiss('Cross click');
  }

  public onAdd(e) {
    e.stopPropagation();
    if (e.target.value.length === 0) return;
    const input = e.target;
    const value = e.target.value;
    if (value.length > 0) {
      this.selectedUsers.push(value);
      this.usersEmails.push(value);
      this.quoteStateService.setUsersEmail(this.usersEmails);
      input.value = '';
      this.userCtrl.setValue(null);
    }
    this.users = JSON.parse(JSON.stringify(this.reqUsersList));
  }
  public keyup(e) {
    if (e.keyCode === 13) {
      const input = e.target;
      const value = e.target.value;
      if (value.length > 0) {
        this.selectedUsers.push(value);
        this.usersEmails.push(value);
        this.quoteStateService.setUsersEmail(this.usersEmails);
        input.value = '';
        this.userCtrl.setValue(null);
      }
      this.users = JSON.parse(JSON.stringify(this.reqUsersList));
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
