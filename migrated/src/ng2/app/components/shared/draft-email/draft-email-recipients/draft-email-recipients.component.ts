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
    console.log('ngOnInit', this.data);

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
    console.log('getCompanyList');
    if (this.companiesState.getCompanies().length > 0) {
      this.setCompanyList(this.companiesState.getCompanies());

    } else {
      this.companiesState.getOnCompanies().subscribe((data) => {
        this.setCompanyList(data);
      })
    }
  }
  private setCompanyList(data) {
    console.log('setCompanyList');
    this.reqCompanyList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt);
    this.companyList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt);

  }
  
  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {
    console.log('remove');
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
    console.log('selected');
    this.showError = false;
    this.selectedCompanies.push(company.companyInfo.contacts[0].primaryEmail);
    this.companyEmails.push(company.companyInfo.contacts[0].primaryEmail);
    this.onCompanyEmails.emit(this.companyEmails);
  //  this.userInput.nativeElement.blur();
    this.userInput.nativeElement.value = '';
    this.companyCtrl.setValue(null);
    this.companyList = this.reqCompanyList;
    console.log('this.companyList',this.companyList);
 /*   this.userInput.nativeElement.value = '';
    this.companyList = this.reqCompanyList;*/
  }

  onSearch(event) {
    console.log('onSearch');
    
    this.companyList = this.reqCompanyList.filter(item => item.companyInfo.contacts[0].primaryEmail.includes(event.target.value));
  }
  onKeyUp (event) {
    console.log('onKeyUp');
   
    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;
  
      if ((value || '').trim()) {
        this.selectedCompanies.push(value.trim());
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
