import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
import { CompanyUpdate } from 'src/ng2/app/components/companies/class/company-update';
import { InvoiceTicketsService } from 'src/ng2/app/components/setting/invoice-tickets/invoice-tickets.service';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceNote } from '../../../billable/class/invoice-note';
import { QuoteEdit } from '../../class/quote-edit';

import { QuoteValdiate } from '../../class/quote-vildate';
import { QuoteValdiateEdit } from '../../class/quote-vildate-edit';
import { ServiceListQuoteComponent } from '../../quote-aside-add/service-list-quote/service-list-quote.component';
import { QuoteStateService } from '../../quote-create/quote-state.service';

@Component({
  selector: 'app-quote-aside-edit-body',
  templateUrl: './quote-aside-edit-body.component.html',
  styleUrls: ['./quote-aside-edit-body.component.scss']
})
export class QuoteAsideEditBodyComponent implements OnInit, OnDestroy {
  @ViewChild('servicesList') servicesList: ServiceListQuoteComponent;
  @Input() validate: QuoteValdiateEdit = new QuoteValdiateEdit();
  @Output() onStopPreloader = new EventEmitter();
  quoteCompany: any;
  notes: Array<InvoiceNote>;
  formatDate: string = FORMAT_DATE_2;
  showPreloader: boolean = true;
  quote: QuoteEdit;
  open: boolean = false;
  changeGlobalNote: boolean = false;
  companies = [];
  sub: Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    private companiesState: CompaniesStateService,
    private billableService: BillableService,
    private elRef: ElementRef,
    private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    private invoiceTicketsService: InvoiceTicketsService,
    public cd: ChangeDetectorRef,

    private quoteServices: QuoteService,) { }


  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getCLientsList(this.companiesState.getCompanies());
    this.companiesState.getOnCompanies().subscribe((data) => {
      this.getCLientsList(data);
    })
    let getChangeCompanies = this.companiesState.getChangeCompanies().subscribe((data: CompanyUpdate) => {
      if (data.action === 'COMPANY_SAVED' && this.quoteCompany.id === data.data.id) {
        this.quoteCompany.name = data.data.name;
        this.quoteCompany.companyInfo.contacts[0].firstName = data.data.companyInfo.contacts[0].firstName;
        this.quoteCompany.companyInfo.contacts[0].lastName = data.data.companyInfo.contacts[0].lastName;
        this.quoteCompany.companyInfo.addresses[0].address = data.data.companyInfo.addresses[0].address;
        this.quoteCompany.companyInfo.contacts[0].primaryEmail = data.data.companyInfo.contacts[0].primaryEmail;
      }
    });
    this.getInvoiceNote();
    this.sub.add(getChangeCompanies);
    let getOnEdit = this.quoteStateService.getOnEdit().subscribe(quote => {
      this.quoteServices.getQuote(quote.id).subscribe((data) => {
        this.quote = new QuoteEdit(data);
        // this.elRef.nativeElement.querySelector("#description-global-note").value = this.quote.termsAndConditions;
        this.billableStateService.setRegulatNote(this.quote.regularNote);
        this.quoteCompany = this.companiesState.getCompanies().find(item => item.id === this.quote.company.id);
        this.cd.detectChanges();
        this.servicesList.getServicesList();
        this.onStopPreloader.emit(null);
      })
    })
    this.sub.add(getOnEdit);

  }
  public resetQuote() {
    this.quote = null;
    this.billableStateService.setRegulatNote(null);
  }

  public getValidate() {
    return this.validate;
  }
  public getQuote() {
    return this.quote;
  }
   public getQuotePreview() {
     return this.quote.getDataForPreview(this.quoteCompany);
   } 
  private getInvoiceNote() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.notes = data;



    })
  }

  onUpdateGlobalNote() {
    this.invoiceTicketsService.updateTermsAndConditions(this.elRef.nativeElement.querySelector("#description-global-note").value).subscribe(data => {
      this.changeGlobalNote = false;
      this.quote.termsAndConditions = this.elRef.nativeElement.querySelector("#description-global-note").value;

      this.validate.resetValidate();
    })
  }
  onCheckUpdateGlobalNote() {
    if (this.elRef.nativeElement.querySelector("#description-global-note").value) this.changeGlobalNote = true;
  }

  getSubTotalServices() {
    return this.quote.services.reduce((a, b) => a + (b.rate * b.quantity), 0);
  }
  getSubTotalProducts() {
    return this.quote.products.reduce((a, b) => a + (b.sale * b.quantity), 0);
  }
  getSubTotal() {
    return this.getSubTotalServices() + this.getSubTotalProducts() + this.getTotalTaxes();
  }
  getTotalTaxes() {
    let totalTaxes = 0;
    this.quote.services.forEach(service => {
      totalTaxes += service.taxes.reduce((a, b) => a + (b.rate * service.quantity), 0);
    })
    this.quote.products.forEach(product => {
      totalTaxes += product.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0);
    })

    return totalTaxes;
  }
  
  public updateInvoiceData(request) {
    console.log("request", request.regularInvoiceNote);
    this.quote.setRegulatNote(request.regularInvoiceNote);
    this.validate.resetValidate();

  }
  public onChangeQuoteNumber(data) {
    this.quote.number=data;
    this.validate.resetValidate();
    this.validate.resetNumber();
  }
  selectProduct(data) {
    console.log("data", data);

    this.quote.addProduct(data);
    this.validate.resetServicesProducts();
    this.validate.resetValidate();
    console.log("this.quote", this.quote.products);
  }
  onAddService(data) {
    console.log("data", data);
    this.quote.addService(data);
    this.validate.resetServicesProducts();
    this.validate.resetValidate();
  }
  private getCLientsList(data) {
    this.companies = data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => !item.deletedAt)
  }
  removeService(i) {
    this.quote.services.splice(i, 1);
  }
  removeProduct(i) {
    this.quote.products.splice(i, 1);
  }
  getPriceService(service) {
    service.sum = this.quoteStateService.getPrice(service.rate, service.quantity, service.taxes) + service.taxes.reduce((a, b) => a + (b.rate * service.quantity), 0);
    service.taxSum = service.taxes.reduce((a, b) => a + (b.rate * service.quantity), 0);
    return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(service.rate, service.quantity, service.taxes) + service.taxes.reduce((a, b) => a + (b.rate * service.quantity), 0));

  }

  onEditCustomer() {
    this.companiesService.getCompany(this.quoteCompany.id).subscribe((data: any) => {
      let customerCompany: CompanyProfile = new CompanyProfile();
      customerCompany.onEditMode(data);
      this.billableStateService.onEditCustomer(customerCompany);
      this.validate.resetValidate();
    })

  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  onChangeQuoteDate(data) {
    this.quote.setQuoteDate((data) ? data : new Date().getTime());
    this.validate.resetValidate();
  }
  onChangeExpiryDate(data) {
    this.quote.setExpiryDate((data) ? data : new Date().getTime());
    this.validate.resetValidate();
  }
  onSelectCompany(data) {
    this.quoteCompany = data;
    this.quote.setCompany(data);
    this.cd.detectChanges();
    if (data) {
      this.validate.resetCompany();
      this.servicesList.getServicesList();
    } else {
      this.servicesList.resetServicesList();
    }
    this.quote.resetServices();
    this.validate.resetValidate();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
