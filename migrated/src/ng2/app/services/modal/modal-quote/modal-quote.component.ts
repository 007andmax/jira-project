import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgbActiveModal, NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { USER } from "../../../const/users";
import { UsersService } from "../../users/users.service";
import { QuoteStateService } from "../../../components/billing/quotes/quote-create/quote-state.service";
import { QuoteService } from "../../quote/quote.service";
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { AlertStateService } from 'src/ng2/app/components/shared/alert/services/alert-state.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/confirm/services/confirm-state.service';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm/confirm.component';

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
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  selectedUsers = [];
  showError = false;
  showErrorClient = false;
  usersEmails = [];
  users = [];
  initialized: boolean = false;
  showConfirm: boolean = false;
  sub: Subscription = new Subscription();
  isChange:boolean = false;


  private unsubscribe: Subject<void> = new Subject();
  @Input() public data;
  @Input() public onlySendMode = false;
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
    private userService: UsersService,
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService,
    private alertState: AlertStateService,
    private eRef: ElementRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    
  }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    console.log('this.data', this.data);
    (this.data) && this.initResendMode();
    this.getAllUsers();
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
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
      console.log('modalRef.componentInstance',modalRef.componentInstance);
      modalRef.componentInstance.message = 'Do you want to close this window? All entered information will be lost.';
    }
  }

  /**
   * Add selected user
   * @param event - selected user
   */
  public add(event: MatChipInputEvent): void {
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

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.usersEmails.splice(index, 1);
      this.quoteStateService.setUsersEmail(this.usersEmails);
      // this.isResend && (this.data.recipients = this.usersEmails);
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
    this.userInput.nativeElement.blur();
    this.userCtrl.setValue(null);
  }

  /**
   * Get user list
   */
  private getAllUsers() {
    this.showErrorClient = false;
    const company = (this.data && this.data.company && this.data.company.id) || this.quoteStateService.getClient();
    if (company || company.id) {
      this.userService.getAllusers().subscribe((res: any) => {
        this.initialized = true;
        const techUser = res.filter((item) => item.accountType === USER.TYPE.TECH && !item.deletedAt);
        let clientUser = [];
        if (typeof company === 'string' || company instanceof String) {
          clientUser = res.filter((item) => {
            return item.accountType === USER.TYPE.CLIENT && item.company.id == company && !item.deletedAt
          });
        } else {
          clientUser = res.filter((item) => {
            return item.accountType === USER.TYPE.CLIENT && item.company.id == company.id && !item.deletedAt
          });
        }
        this.users = [...techUser, ...clientUser];
      })
    } else {
      this.showErrorClient = true;
    }
  }

  /**
   * Set subject
   * @param subject - subject email value
   */
  public setSubject(value) {
    this.subject = value;
    // this.quoteStateService.setSubject(value);
    // this.isResend && (this.data.subject = value);
  }

  /**
   * Set message
   * @param value - email massage
   */
  public setMessage(value) {
    this.message = value;
    //  this.quoteStateService.setMessage(value);
    // this.isResend && (this.data.message = value);
  }

  private onInitSubjectAndMessage() {
    this.quoteStateService.setSubject(this.subject);
    this.quoteStateService.setMessage(this.message);
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
      if (!this.isResend) {
        this.onInitSubjectAndMessage();
        this.quoteStateService.saveSandMode();
      } else {
        if (!this.data.id) {
          this.onInitSubjectAndMessage();
          this.quoteStateService.saveSandMode();
        } else {
          this.data.message = this.message;
          this.data.subject = this.subject;

          this.quoteService.resend(this.data, this.selectedUsers)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              if (res) {
                this.quoteService.repeatSend(res['id']).subscribe((res) => { })
                if (!this.onlySendMode) this.quoteStateService.goToQuote();

              }
              this.unsubscribe.next();
              this.unsubscribe.complete();
            })
        }


      }
      this.activeModal.close();
    } else {
      this.showError = true;
    }
  }

  /**
   * Init resend mode
   */
  public initResendMode() {
    this.isResend = true;
    if (this.data.recipients && this.data.recipients.length === 0) {
      this.message = this.data.message && this.data.message !== "null" ? JSON.parse(JSON.stringify(this.data.message)) : '';
      this.subject = this.data.subject && this.data.subject !== "null" ? JSON.parse(JSON.stringify(this.data.subject)) : '';
    } else {
      if (this.data.recipients && this.data.recipients.length > 0 && this.data.recipients[0] !== "") {
        this.selectedUsers = JSON.parse(JSON.stringify([...this.data.recipients]));
      } else {
        this.data.recipients = [];
        this.selectedUsers = JSON.parse(JSON.stringify([...this.data.recipients]));
      }
      this.message = this.data.message && this.data.message !== "null" ? JSON.parse(JSON.stringify(this.data.message)) : '';
      this.subject = this.data.subject && this.data.subject !== "null" ? JSON.parse(JSON.stringify(this.data.subject)) : '';
    }

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

  public keyup(e) {

    if (e.keyCode === 13) {

      if (this.userInput.nativeElement.value.length > 0) {
        this.selectedUsers.push(this.userInput.nativeElement.value);
        this.usersEmails.push(this.userInput.nativeElement.value);
        this.quoteStateService.setUsersEmail(this.usersEmails);
        this.userInput.nativeElement.value = "";
        this.userCtrl.setValue(null);
      }
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
