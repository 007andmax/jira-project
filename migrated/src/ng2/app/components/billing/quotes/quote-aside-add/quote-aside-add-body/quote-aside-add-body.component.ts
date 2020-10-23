import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
import { CompanyUpdate } from 'src/ng2/app/components/companies/class/company-update';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceFormEditCustomerComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.component';
import { QuoteAdd } from '../../class/quote-add';
import { QuoteStateService } from '../../quote-create/quote-state.service';
import { ServiceListQuoteComponent } from '../service-list-quote/service-list-quote.component';

@Component({
  selector: 'app-quote-aside-add-body',
  templateUrl: './quote-aside-add-body.component.html',
  styleUrls: ['./quote-aside-add-body.component.scss']
})
export class QuoteAsideAddBodyComponent implements OnInit {
  @ViewChild('companyEdit') companyEdit: InvoiceFormEditCustomerComponent;
  @ViewChild('servicesList') servicesList: ServiceListQuoteComponent;
  quoteCompany: any;

  formatDate: string = FORMAT_DATE_2;
  today = new Date().getTime();
  quote: QuoteAdd = new QuoteAdd();
  companies = [];
  sub: Subscription = new Subscription();
  constructor(private companiesState: CompaniesStateService,
    private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    private companiesStateService: CompaniesStateService,
    private quoteStateService: QuoteStateService,
    public cd: ChangeDetectorRef,
    private quoteServices: QuoteService,) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getCLientsList(this.companiesState.getCompanies());
    this.companiesState.getOnCompanies().subscribe((data) => {
      this.getCLientsList(data);
    })
    this.quoteServices.getQuoteNumber().subscribe((data: any) => {
      console.log("data", data);
      this.quote.number = data.number;
    });
    let getChangeCompanies = this.companiesStateService.getChangeCompanies().subscribe((data: CompanyUpdate) => {
      if (data.action === 'COMPANY_SAVED' && this.quoteCompany.id === data.data.id) {
        this.quoteCompany.name = data.data.name;
        this.quoteCompany.companyInfo.contacts[0].firstName = data.data.companyInfo.contacts[0].firstName;
        this.quoteCompany.companyInfo.contacts[0].lastName = data.data.companyInfo.contacts[0].lastName;
        this.quoteCompany.companyInfo.addresses[0].address = data.data.companyInfo.addresses[0].address;
        this.quoteCompany.companyInfo.contacts[0].primaryEmail = data.data.companyInfo.contacts[0].primaryEmail;
      }
    })
    this.sub.add(getChangeCompanies);
  }
  selectProduct(data) {
    console.log("data", data);

    this.quote.addProduct(data);
    console.log("this.quote",this.quote.products);
  }
  onAddDefaultService(data) {
    console.log("data", data);
    this.quote.addService(data);
  }
  private getCLientsList(data) {
    this.companies = data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => !item.deletedAt)
  }
  getPriceService(service) {
    return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(service.item.rate, service.quantity, service.item.taxes) + this.quoteStateService.getTaxPrice(service.item.rate, service.quantity, service.item.taxes));

  }
  getPriceProduct(product) {
      return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(product.item.sale, product.quantity, product.item.taxes) + this.quoteStateService.getTaxPrice(product.item.sale, product.quantity, product.item.taxes));
  }
  onEditCustomer() {
    this.companiesService.getCompany(this.quoteCompany.id).subscribe((data: any) => {
      let customerCompany: CompanyProfile = new CompanyProfile();
      customerCompany.onEditMode(data);
      this.billableStateService.onEditCustomer(customerCompany);
    })

  }
  onChangeQuoteDate(data) {
    this.quote.setQuoteDate((data) ? data : new Date().getTime());
  }
  onChangeExpiryDate(data) {
    this.quote.setExpiryDate((data) ? data : new Date().getTime());
  }
  onSelectCompany(data) {
    this.quoteCompany = data;
    this.cd.detectChanges();
    if (data) {
      this.servicesList.getServicesList();
    } else {
      this.servicesList.resetServicesList();
    }
  }

}
