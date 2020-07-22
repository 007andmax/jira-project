import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from "moment";
import { Invoice } from '../class/invoice';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
@Component({
  selector: 'app-invoices-item',
  templateUrl: './invoices-item.component.html',
  styleUrls: ['./invoices-item.component.scss']
})
export class InvoicesItemComponent implements OnInit {
  @Input() invoice: Invoice;
  company: any;
  @Output() onPreviewInvoice = new EventEmitter<any>();
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  getDueDate (){
    var dueDate = new Date(this.invoice.dueDate).getTime();
    var today = Date.now();
    let overDue = (dueDate - today)/86400000;
    let outstanding = (new Date(this.invoice.date).getTime() - today)/86400000;
    let isOverDue = (overDue < 0);
    let isOutstanding = (overDue > 0);
    if(isOverDue) {
   //   $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(overDue))) + 1000000000;
     // $scope.invoice.dueDatePositionForSorting = 0;
      return Math.abs(Math.floor(overDue));
    } else if (isOutstanding) {
  //    $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(outstanding))) + 2000000000;
    //  $scope.invoice.dueDatePositionForSorting = 1;
      return Math.abs(Math.floor(outstanding));
    }

  };
   getPaidOnDate () {
    var today = Date.now();
    var paidOn =  new Date(this.invoice.paidOn).getTime();
    var paid = (today - paidOn)/86400000;
   // $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(paid))) + 3000000000 ;
  //  $scope.invoice.dueDatePositionForSorting = 2;
    return Math.floor(Math.abs(paid));
  };
  onShowPreviewInvoice() {
    this.onPreviewInvoice.emit(null);
  }
}
