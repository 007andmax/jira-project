import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
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
  selectedClient = null;
  loadingInProgress: boolean = false;
  constructor(private reportsStateService: ReportsStateService, public cd: ChangeDetectorRef, ) { }

  ngOnInit() {
    this.reportsStateService.accountsReceivable.subscribe((data: AccountsReceivable) => {
      this.accountsReceivable.setDataFromObject(JSON.parse(JSON.stringify(data.getDataObject())));
      console.log("this.accountsReceivable", this.accountsReceivable);

      this.headers = [];
      this.headers.push("Company Name");
      this.headers.push("Current");

      this.headers.push("<1 month");
      this.headers.push("<2 month");
      this.headers.push("<3 month");
      this.headers.push("Older");
      this.headers.push("Total");
      this.list = [];
      this.accountsReceivable.lines.forEach((item, index) => {
        let list = [];
        
        if (this.accountsReceivable.type === "SUMMARY")   list.push(item.clientCompanyName);
        if (this.accountsReceivable.type === "DETAILED")   list.push(item.invoiceNumber);
      
        list.push(`$${this.parseTotal(item.currentSum)}`);

        list.push(`$${this.parseTotal(item.month1Sum)}`);
        list.push(`$${this.parseTotal(item.month2Sum)}`);
        list.push(`$${this.parseTotal(item.month3Sum)}`);
        list.push(`$${this.parseTotal(item.olderSum)}`);
        list.push(`$${this.parseTotal(item.totalSum)}`);



        this.list.push(list);
      })
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
    })
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {

  }
  onSelectedClient(client) {
    this.selectedClient = client;
   
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }

}
