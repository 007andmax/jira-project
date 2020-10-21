import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { QuotePreview } from '../class/quote-preview';
import { QuoteStateService } from '../quote-create/quote-state.service';
import * as moment from "moment";
import { Company } from 'src/ng2/app/interfaces/company/company';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quote-aside-preview',
  templateUrl: './quote-aside-preview.component.html',
  styleUrls: ['./quote-aside-preview.component.scss']
})
export class QuoteAsidePreviewComponent implements OnInit, OnDestroy {
  quote: QuotePreview;
  showPreloader: boolean = true;
  toggleQuoteMessage: boolean = true;
  toggleStatus: boolean = true;
  currentCompany: any;
  quoteCompany: Company;
  open: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    private quoteServices: QuoteService,
    private modalService: NgbModal,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {

   let getOnPreview =  this.quoteStateService.getOnPreview().subscribe(quote => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
      this.quoteCompany = this.companiesStateService.getCompanies().find(item => item.id === quote.company.id);
      this.open = true;
      this.quoteServices.getQuote(quote.id).subscribe((data) => {
        console.log("this.quoteCompany", this.quoteCompany);
        this.quote = new QuotePreview(data);
        this.open = true;
        this.showPreloader = false;
        console.log("this.quote", this.quote);
        console.log("this.currentCompany", this.currentCompany);
      })
    })
    this.sub.add(getOnPreview);
  }
  close() {
    this.open = false;
    this.showPreloader = true;

  }
  getTotalTaxes() {
    let totalTaxes = 0;
    totalTaxes += this.quote.services.reduce((a, b) => a + b.taxSum, 0);
    totalTaxes += this.quote.products.reduce((a, b) => a + b.taxSum, 0);
    return totalTaxes;
  }
  getSubTotalServices() {
    return this.quote.services.reduce((a, b) => a + b.sum, 0);
  }
  getSubTotalProducts() {
    return this.quote.products.reduce((a, b) => a + b.sum, 0);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }
  downloadPdf() {
    this.quoteServices.downloadPdf(this.quote.id).subscribe((res) => this.quoteServices.downLoadFile(res, this.quote.id, this.quote.company.name, this.quote.number));
  }
  cancelQuote() {
    this.quoteServices.cancelQuote(this.quote.company, this.quote.id).subscribe((res) => {
      this.close();
    });
  }
  convertToInvoice() {
    this.quoteServices.convertToInvoice({ companyInfo: this.quote.company }, this.quote.id).subscribe((res) => {

    });
  }
  archiveQuote() {
    this.quoteServices.archiveQuote(this.quote.company, this.quote.id).subscribe((res) => {

    });
  }
  public resend() {
    if (this.quote.status === 'TICKETED' || this.quote.status === 'INVOICED') {
      this.quoteServices.repeatSend(this.quote.id).subscribe();
    } else {
      let recipients = this.quote.recipients;
      //  if (typeof recipients === "string") this.quote.recipients = recipients.split(',');
      this.quoteServices.getQuote(this.quote.id).subscribe((data) => {
        const modalRef = this.modalService.open(ModalQuoteComponent, data);
        modalRef.componentInstance.data = data;
      })

    }

  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
