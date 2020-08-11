import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from '../class/payment';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";

@Component({
  selector: 'app-payments-aside',
  templateUrl: './payments-aside.component.html',
  styleUrls: ['./payments-aside.component.scss']
})
export class PaymentsAsideComponent implements OnInit {
  @Input() payment: Payment;
  @Output() onClose = new EventEmitter<any>();
  currentCompany: any;
  company: any;
  constructor(private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.payment.clientCompanyId);
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };
  getDate(date) {
    return  moment(date).format('DD MMM YYYY');
  }
  close() {
    this.onClose.emit(null);
  }
}
