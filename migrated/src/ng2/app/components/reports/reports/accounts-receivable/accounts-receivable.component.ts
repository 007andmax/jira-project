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

        list.push(item.clientCompanyName);
        list.push(`$${item.currentSum}`);

        list.push(`$${item.month1Sum}`);
        list.push(`$${item.month2Sum}`);
        list.push(`$${item.month3Sum}`);
        list.push(`$${item.olderSum}`);
        list.push(`$${item.totalSum}`);



        this.list.push(list);
      })
      let list = [];
      list.push("Total");
      list.push(`$${this.accountsReceivable.totalCurrentSum}`);
      list.push(`$${this.accountsReceivable.total1MonthSum}`);
      list.push(`$${this.accountsReceivable.total2MonthSum}`);
      list.push(`$${this.accountsReceivable.total3MonthSum}`);
      list.push(`$${this.accountsReceivable.totalOlderSum}`);
      list.push(`$${this.accountsReceivable.totalSum}`);
      this.list.push(list);
      this.cd.detectChanges();
    })
  }

}
