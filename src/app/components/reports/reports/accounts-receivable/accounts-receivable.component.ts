
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountsReceivable } from '../../class/accounts-receivable';
import { AccountsReceivableItem } from './class/accounts-receivable-item';
import { ReportMenuComponent } from '../../report-menu/report-menu.component';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule],
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss'],

})
export class AccountsReceivableComponent implements OnInit {
  accountsReceivable: AccountsReceivable = new AccountsReceivable();
  headers = [];
  list = [];
  classes = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  constructor(public cd: ChangeDetectorRef,) { }

  ngOnInit() {

  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.accountsReceivable.clearLines();
    this.accountsReceivable.setData(data);
    this.headers = [];
    this.headers.push("Company Name");
    if (this.accountsReceivable.type == "DETAILED") this.headers.push("Invoice Date");
    this.headers.push("Current");
    this.headers.push("<1 month");
    this.headers.push("<2 month");
    this.headers.push("<3 month");
    this.headers.push("Older");
    this.headers.push("Total");
    this.classes = (this.accountsReceivable.type != "DETAILED") ? ["accounts-receivable__col-company-name", "", "", "", "", "", ""] : ["accounts-receivable__col-company-name", "accounts-receivable__col-inovice-date", "", "", "", "", "", ""];
    this.list = [];
    this.accountsReceivable.reportData.forEach((item, index) => {
      let list: Array<AccountsReceivableItem> = [];
      if (this.accountsReceivable.type != "DETAILED") {
        list.push(new AccountsReceivableItem(item.clientCompanyName));
        list.push(new AccountsReceivableItem(`$${this.parseTotal(item.totalCurrentSum)}`));
        list.push(new AccountsReceivableItem(`$${this.parseTotal(item.total1MonthSum)}`));
        list.push(new AccountsReceivableItem(`$${this.parseTotal(item.total2MonthSum)}`));
        list.push(new AccountsReceivableItem(`$${this.parseTotal(item.total3MonthSum)}`));
        list.push(new AccountsReceivableItem(`$${this.parseTotal(item.totalOlderSum)}`));
        list.push(new AccountsReceivableItem(`$${this.parseTotal(item.totalSum)}`));
        this.list.push(list);
      } else {
        this.list.push([new AccountsReceivableItem(item.clientCompanyName, "qt-fw-b"), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem('')]);
      }
      item.lines.forEach((itemLine, index) => {
        let listLine = [];
        listLine.push(new AccountsReceivableItem(itemLine.invoiceNumber));
        if (this.accountsReceivable.type == "DETAILED") listLine.push(new AccountsReceivableItem(itemLine.invoiceCreationDate));
        listLine.push(new AccountsReceivableItem(`$${this.parseTotal(itemLine.currentSum)}`));
        listLine.push(new AccountsReceivableItem(`$${this.parseTotal(itemLine.month1Sum)}`));
        listLine.push(new AccountsReceivableItem(`$${this.parseTotal(itemLine.month2Sum)}`));
        listLine.push(new AccountsReceivableItem(`$${this.parseTotal(itemLine.month3Sum)}`));
        listLine.push(new AccountsReceivableItem(`$${this.parseTotal(itemLine.olderSum)}`));
        listLine.push(new AccountsReceivableItem(`$${this.parseTotal(itemLine.totalSum)}`));
        this.list.push(listLine);
      });
      if (this.accountsReceivable.type == "DETAILED") {
        this.list.push([new AccountsReceivableItem('Total', "qt-fw-b"), new AccountsReceivableItem(''), new AccountsReceivableItem(this.parseTotal(item.totalCurrentSum)), new AccountsReceivableItem(this.parseTotal(item.total1MonthSum)), new AccountsReceivableItem(this.parseTotal(item.total2MonthSum)), new AccountsReceivableItem(this.parseTotal(item.total3MonthSum)), new AccountsReceivableItem(this.parseTotal(item.totalOlderSum)), new AccountsReceivableItem(this.parseTotal(item.totalSum))]);
        this.list.push([new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem('')]);
      }
    })
    if (this.accountsReceivable.type != "DETAILED") this.list.push([new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem('')]);
    if (this.accountsReceivable.type == "DETAILED") this.list.push([new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem(''), new AccountsReceivableItem('')]);
    let list = [];
    if (this.accountsReceivable.type == "DETAILED") {
      list.push(new AccountsReceivableItem('Report total', "qt-fw-b"));
      list.push(new AccountsReceivableItem(``));
    } else {
      list.push(new AccountsReceivableItem('Total', "qt-fw-b"));
    }
    list.push(new AccountsReceivableItem(`$${this.parseTotal(this.accountsReceivable.totalCurrentSum)}`));
    list.push(new AccountsReceivableItem(`$${this.parseTotal(this.accountsReceivable.total1MonthSum)}`));
    list.push(new AccountsReceivableItem(`$${this.parseTotal(this.accountsReceivable.total2MonthSum)}`));
    list.push(new AccountsReceivableItem(`$${this.parseTotal(this.accountsReceivable.total3MonthSum)}`));
    list.push(new AccountsReceivableItem(`$${this.parseTotal(this.accountsReceivable.totalOlderSum)}`));
    list.push(new AccountsReceivableItem(`$${this.parseTotal(this.accountsReceivable.totalSum)}`));
    this.list.push(list);

    this.cd.detectChanges();
  }
  onSelectedClient(client) {
    this.selectedClient = client;
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  public trackByIndex(index, item) {
    return index;
  }
}
