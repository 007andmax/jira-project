import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyItem } from 'src/app/components/companies/class/company-item';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';
import { CompanyUpdate } from 'src/app/components/companies/class/company-update';
import { InvoiceTicketsService } from 'src/app/components/setting/accounting/accounting-settings.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { Service } from 'src/app/interfaces/service/service';
import { BillableService } from 'src/app/services/billable/billable.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { QuoteService } from 'src/app/services/quote/quote.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { InvoiceFormEditCustomerComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.component';
import { InvoiceNote } from '../../../billable/class/invoice-note';
import { QuoteAdd } from '../../class/quote-add';
import { QuoteValdiate } from '../../class/quote-vildate';
import { ServiceListQuoteComponent } from '../service-list-quote/service-list-quote.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { ContractsService } from 'src/app/services/contracts/contracts.service';

@Component({
  selector: 'app-quote-aside-add-body',
  templateUrl: './quote-aside-add-body.component.html',
  styleUrls: ['./quote-aside-add-body.component.scss']
})
export class QuoteAsideAddBodyComponent implements OnInit, OnDestroy {
  @ViewChild('companyEdit') companyEdit: InvoiceFormEditCustomerComponent;
  @ViewChild('servicesList') servicesList: ServiceListQuoteComponent;
  @ViewChild('expiryDate') expiryDate: DatePickerComponent;
  @Input() validate: QuoteValdiate = new QuoteValdiate();
  quoteCompany: CompanyItem;
  notes: Array<InvoiceNote>;
  formatDate: string = FORMAT_DATE_2;
  quote: QuoteAdd = new QuoteAdd();
  changeGlobalNote: boolean = false;
  termsAndConditions: string;
  companies = [];
  areTicketsPresented: boolean = false;
  areTicketsTerminated: boolean = false;
  services: Array<Service> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesState: CompaniesStateService,
    private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    private quoteStateService: QuoteStateService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private invoiceTicketsService: InvoiceTicketsService,
    private billableService: BillableService,
    private permissionsService: PermissionsService,
    public customerPortalStateService: CustomerPortalStateService,
    private contractsService: ContractsService,
    private quoteServices: QuoteService,) { }


  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getCLientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getCLientsList(data);
    })
    this.sub.add(getOnCompanies);
    let getQuoteNumber = this.quoteServices.getQuoteNumber().subscribe((data: any) => {
      this.quote.number = data.number;
    });
    this.sub.add(getQuoteNumber);
    let getChangeCompanies = this.companiesState.getChangeCompanies().subscribe((data: CompanyUpdate) => {
      if (data.action === 'COMPANY_SAVED' && this.quoteCompany && this.quoteCompany.id === data.data.id) {
        this.quoteCompany.name = data.data.name;
        this.quoteCompany.companyInfo.contacts[0].firstName = data.data.companyInfo.contacts[0].firstName;
        this.quoteCompany.companyInfo.contacts[0].lastName = data.data.companyInfo.contacts[0].lastName;
        //  this.quoteCompany.companyInfo.addresses[0].address = data.data.companyInfo.addresses[0].address;
        this.quoteCompany.companyInfo.contacts[0].primaryEmail = data.data.companyInfo.contacts[0].primaryEmail;
        if (data.data.companyInfo.addresses.length == 1) {
          this.quoteCompany.companyInfo.addresses[0] = data.data.companyInfo.addresses[0];
        }
        if (data.data.companyInfo.addresses.length == 2) {
          this.quoteCompany.companyInfo.addresses[0] = data.data.companyInfo.addresses.find(item => item.isPrimary);
          this.quoteCompany.companyInfo.addresses[1] = data.data.companyInfo.addresses.find(item => !item.isPrimary);
        }
      }
    });
    if (this.quoteStateService.getQuoteForCopy()) this.onInitCopy();
    if (!this.customerPortalStateService.isCustomerPortal) this.getInvoiceNote();
    this.sub.add(getChangeCompanies);
  }
  onInitCopy() {
    this.quote.setCopyData(this.quoteStateService.getQuoteForCopy());
    this.quoteCompany = new CompanyItem(JSON.parse(JSON.stringify(this.companiesState.getCompanies().find(item => item.id === this.quote.companyId))));
    this.quote.setBillTo(this.quoteCompany.companyInfo.addresses[0].id);
    if (this.quoteCompany.companyInfo.addresses.length == 2) this.quote.setShipTo(this.quoteCompany.companyInfo.addresses[1].id);
    this.cd.detectChanges();
    this.getServicesList();
  }
  public onChangeQuoteNumber(data) {
    this.quote.number = data;
    this.validate.resetValidate();
    this.validate.resetNumber();
  }
  public getValidate() {
    return this.validate;
  }
  public getQuote() {
    return this.quote;
  }
  public getQuotePreview() {
    return this.quote.getDataForPreview(this.quoteCompany, this.termsAndConditions);
  }
  getServicesList() {
    this.quoteServices.getServiceList(this.quoteCompany.id).subscribe((res: any) => {
      this.services = res;
      this.getServiceAgreements(this.quoteCompany.id);
      this.onCheckValidateServicesByCompany();
    });
  }
  private getServiceAgreements(id) {
    this.contractsService.getServiceAgreementsByCompany(id).subscribe((data: any) => {
      let Agreements = data;
      this.areTicketsPresented = (Agreements.length > 0) ? true : false;
      this.areTicketsTerminated = Agreements.every((el) => {
        return el.status === 'EXPIRED' || el.status === 'TERMINATED'
      })
    })
  }

  public onCheckValidateServicesByCompany() {
    this.quote.checkValidateServicesByCompany(this.services);
    this.cd.detectChanges();
  }
  private getInvoiceNote() {
    this.billableService.getInvoiceNote().subscribe(data => {
      if (this.quoteStateService.getQuoteForCopy() && this.quote.note && this.quote.note.length > 0) {
        this.billableStateService.setRegulatNote(new InvoiceNote({ content: this.quote.note }));
      }
      this.notes = data;
    })
    this.invoiceTicketsService.termsAndConditions().subscribe((data: any) => {
      this.termsAndConditions = data.conditions;
      this.elRef.nativeElement.querySelector("#description-global-note").value = data.conditions;
    })
  }
  onUpdateGlobalNote() {
    this.invoiceTicketsService.updateTermsAndConditions(this.elRef.nativeElement.querySelector("#description-global-note").value).subscribe(data => {
      this.changeGlobalNote = false;
      this.termsAndConditions = this.elRef.nativeElement.querySelector("#description-global-note").value;
      this.validate.resetValidate();
    })
  }
  onCheckUpdateGlobalNote() {
    if (this.termsAndConditions) this.changeGlobalNote = true;
  }

  getSubTotalServices() {
    return this.quote.services.reduce((a, b) => a + (b.item.rate * b.quantity), 0);
  }
  getSubTotalProducts() {
    return this.quote.products.reduce((a, b) => a + (b.item.sale * b.quantity), 0);
  }
  getSubTotal() {
    return this.getSubTotalServices() + this.getSubTotalProducts() + this.getTotalTaxes();
  }
  getTotalTaxes() {
    let totalTaxes = 0;
    totalTaxes += this.quote.services.reduce((a, b) => a + b.taxSum, 0);
    totalTaxes += this.quote.products.reduce((a, b) => a + b.taxSum, 0);
    return totalTaxes;
  }
  public updateInvoiceData(request) {
    this.quote.setRegulatNote(request.note);
    this.validate.resetValidate();
  }
  selectProduct(data) {
    this.quote.addProduct(data);
    this.validate.resetServicesProducts();
    this.validate.resetValidate();
  }
  onAddService(data) {
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
    this.quote.setQuoteDate(data.day, data.month, data.year, this.companiesState.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.validate.resetValidate();
    this.expiryDate.setEditDate(this.quote.validUntil);
  }
  onChangeExpiryDate(data) {
    this.quote.setExpiryDate(data.day, data.month, data.year, this.companiesState.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.validate.resetValidate();
  }
  onSelectCompany(data) {
    if (data) this.quoteCompany = new CompanyItem(JSON.parse(JSON.stringify(data)));
    if (!data) this.quoteCompany = null;

    this.quote.setCompanyId((data) ? data.id : null);
    this.cd.detectChanges();
    if (data) {
      this.validate.resetCompany();
      //  this.servicesList.getServicesList();
      this.getServicesList();
      this.quote.setBillTo(this.quoteCompany.companyInfo.addresses[0].id);
      if (this.quoteCompany.companyInfo.addresses.length == 2) this.quote.setShipTo(this.quoteCompany.companyInfo.addresses[1].id);
    } else {
      this.quote.setBillTo(null);
      this.quote.setShipTo(null);
      // this.servicesList.resetServicesList();
    }
    // this.quote.resetServices();
    this.validate.resetValidate();
  }
  selectAddress(index, newAddress) {
    this.quoteCompany.companyInfo.addresses[index] = newAddress;
    this.quote.setBillTo(this.quoteCompany.companyInfo.addresses[0].id);
    if (this.quoteCompany.companyInfo.addresses.length == 2) this.quote.setShipTo(this.quoteCompany.companyInfo.addresses[1].id);

  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.item.versionedId.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
