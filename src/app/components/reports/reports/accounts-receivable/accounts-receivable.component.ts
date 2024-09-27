import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountsReceivable } from '../../class/accounts-receivable';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
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
    this.headers.push("Current");
    this.headers.push("<1 month");
    this.headers.push("<2 month");
    this.headers.push("<3 month");
    this.headers.push("Older");
    this.headers.push("Total");
    this.classes = ["accounts-receivable__col-company-name", "", "", "", "", "", ""];
    this.list = [];
    this.accountsReceivable.reportData.forEach((item, index) => {
      let list = [];

      list.push(item.clientCompanyName);
      list.push(`$${this.parseTotal(item.totalCurrentSum)}`);
      list.push(`$${this.parseTotal(item.total1MonthSum)}`);
      list.push(`$${this.parseTotal(item.total2MonthSum)}`);
      list.push(`$${this.parseTotal(item.total3MonthSum)}`);
      list.push(`$${this.parseTotal(item.totalOlderSum)}`);
      list.push(`$${this.parseTotal(item.totalSum)}`);
      this.list.push(list);
      item.lines.forEach((itemLine, index) => {
        let listLine = [];
        listLine.push(itemLine.invoiceNumber);
        listLine.push(`$${this.parseTotal(itemLine.currentSum)}`);
        listLine.push(`$${this.parseTotal(itemLine.month1Sum)}`);
        listLine.push(`$${this.parseTotal(itemLine.month2Sum)}`);
        listLine.push(`$${this.parseTotal(itemLine.month3Sum)}`);
        listLine.push(`$${this.parseTotal(itemLine.olderSum)}`);
        listLine.push(`$${this.parseTotal(itemLine.totalSum)}`);
        this.list.push(listLine);
      });
      if (this.accountsReceivable.type == "DETAILED") this.list.push(['', '', '', '', '', '', '']);
    })
    this.list.push(['', '', '', '', '', '', '']);
    let list = [];
    list.push("Total");
    list.push(`$${this.parseTotal(this.accountsReceivable.totalCurrentSum)}`);
    list.push(`$${this.parseTotal(this.accountsReceivable.total1MonthSum)}`);
    list.push(`$${this.parseTotal(this.accountsReceivable.total2MonthSum)}`);
    list.push(`$${this.parseTotal(this.accountsReceivable.total3MonthSum)}`);
    list.push(`$${this.parseTotal(this.accountsReceivable.totalOlderSum)}`);
    list.push(`$${this.parseTotal(this.accountsReceivable.totalSum)}`);
    this.list.push(list);

    this.cd.detectChanges();
  }
  onSelectedClient(client) {
    this.selectedClient = client;
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }

}
