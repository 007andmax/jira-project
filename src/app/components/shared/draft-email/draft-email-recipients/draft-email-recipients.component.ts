import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, } from '@angular/material';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { Company } from 'src/app/interfaces/company/company';

@Component({
  selector: 'app-draft-email-recipients',
  templateUrl: './draft-email-recipients.component.html',
  styleUrls: ['./draft-email-recipients.component.scss']
})
export class DraftEmailRecipientsComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  companyCtrl = new FormControl();
  selectedCompanies = [];
  showError = false;
  showErrorClient = false;
  companyEmails = [];
  companyList = [];
  reqCompanyList = [];
  @Input() companiesSelected: Array<Company> = [];
  @Input() public data;
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

    private companiesState: CompaniesStateService,
    private draftEmailStateService: DraftEmailStateService,
    public cd: ChangeDetectorRef
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {


    this.getCompanyList();
    /*this.userInput.nativeElement.onblur = (e) => {
      if (this.matAutocomplete.isOpen) {
        let modal = this.matAutocomplete.panel.nativeElement;
        modal.parentNode.style.width = 'max-content';
      }
    }*/
    this.draftEmailStateService.getOnClear().subscribe(data => {
      this.selectedCompanies = [];
      this.companyEmails = [];
      this.companyCtrl.setValue(null);
      this.cd.detectChanges();

    })
  }
  private getCompanyList() {

    if (this.companiesState.getCompanies().length > 0) this.setCompanyList(this.companiesState.getCompanies());
    this.companiesState.getOnCompanies().subscribe((data) => {
      this.setCompanyList(data);
    })

  }
  private setCompanyList(data) {
    this.reqCompanyList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt && item.companyInfo.contacts[0].primaryEmail != '').sort((a, b) => (a.companyInfo.contacts[0].primaryEmail.toLowerCase() > b.companyInfo.contacts[0].primaryEmail.toLowerCase()) ?
      1 : ((b.companyInfo.contacts[0].primaryEmail.toLowerCase() > a.companyInfo.contacts[0].primaryEmail.toLowerCase()) ? -1 : 0));
    this.companyList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt && item.companyInfo.contacts[0].primaryEmail != '').sort((a, b) => (a.companyInfo.contacts[0].primaryEmail.toLowerCase() > b.companyInfo.contacts[0].primaryEmail.toLowerCase()) ?
      1 : ((b.companyInfo.contacts[0].primaryEmail.toLowerCase() > a.companyInfo.contacts[0].primaryEmail.toLowerCase()) ? -1 : 0));
    this.companiesSelected.forEach(item => {
      let primaryContact;
      if (item.companyInfo) {
        if (item.companyInfo.contacts) {
          for (let contact of item.companyInfo.contacts) if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
        }
      }
      if (primaryContact) this.selectedCompanies.push(primaryContact.primaryEmail);
      if (primaryContact) this.companyEmails.push(primaryContact.primaryEmail);
    })
    this.onCompanyEmails.emit(this.companyEmails);
  }

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {

    if (index >= 0) {
      this.selectedCompanies.splice(index, 1);
      this.companyEmails.splice(index, 1);
      this.onCompanyEmails.emit(this.companyEmails);

    }
  }

  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(company): void {

    this.showError = false;
    this.selectedCompanies.push(company.companyInfo.contacts[0].primaryEmail);
    this.companyEmails.push(company.companyInfo.contacts[0].primaryEmail);
    this.onCompanyEmails.emit(this.companyEmails);
    //  this.userInput.nativeElement.blur();
    this.userInput.nativeElement.value = '';
    this.companyCtrl.setValue(null);
    this.companyList = this.reqCompanyList;

    /*   this.userInput.nativeElement.value = '';
       this.companyList = this.reqCompanyList;*/
  }

  onSearch(event) {


    this.companyList = this.reqCompanyList.filter(item => item.companyInfo.contacts[0].primaryEmail.includes(event.target.value));
  }
  public onAdd(event) {
    const input = event.target.input;
    const value = event.target.value;
    if ((value || '').trim()) {
      this.selectedCompanies.push(value.trim());
      this.companyEmails.push(value.trim());
      this.onCompanyEmails.emit(this.companyEmails);
      this.companyList = this.reqCompanyList;
    }
    if (input) {
      input.value = '';
    }
    this.companyCtrl.setValue(null);
  }
  onKeyUp(event) {
    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;
      if ((value || '').trim()) {
        this.selectedCompanies.push(value.trim());
        this.companyEmails.push(value.trim());
        this.onCompanyEmails.emit(this.companyEmails);
        this.companyList = this.reqCompanyList;

      }
      if (input) {
        input.value = '';
      }
      this.companyCtrl.setValue(null);
    }
  }
  public trackByIndex(index, item) {
    return index;
  }


}
