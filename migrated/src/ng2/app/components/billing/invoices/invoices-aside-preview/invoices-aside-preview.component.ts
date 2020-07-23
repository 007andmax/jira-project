import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { Invoice } from '../class/invoice';
import { InvoiceProfile } from '../class/invoice-profile';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
@Component({
  selector: 'app-invoices-aside-preview',
  templateUrl: './invoices-aside-preview.component.html',
  styleUrls: ['./invoices-aside-preview.component.scss']
})
export class InvoicesAsidePreviewComponent implements OnInit {
  @Input() invoice: Invoice;
  invoiceProfile: InvoiceProfile;
  @Output() onClose = new EventEmitter<any>();
  currentCompany: any;
  showPreloader: boolean = true;
  constructor(private invoicesService: InvoicesService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.invoicesService.getInvoice(this.invoice.id).subscribe(data => {
      this.invoiceProfile = new InvoiceProfile(data);
      console.log("invoiceProfile",this.invoiceProfile);
      this.showPreloader = false;
    })


  }
  public getDateTicket(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  close() {
    this.onClose.emit(null);
    this.showPreloader = true;
  }
}
