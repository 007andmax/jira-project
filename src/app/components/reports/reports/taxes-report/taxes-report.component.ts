import { OverviewReportComponent } from './';
import { ReportMenuComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaxesReport } from '../../class/taxes';

@Component({
  standalone: true,
  imports: [OverviewReportComponent, ReportMenuComponent, CommonModule],
    selector: 'app-taxes-report',
    templateUrl: './taxes-report.component.html',
    styleUrls: ['./taxes-report.component.scss'],
    standalone: true
})
export class TaxesReportComponent implements OnInit {
  taxes: TaxesReport = new TaxesReport();
  headers = [];
  list = [];
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
    this.taxes.setData(data);
    this.headers = [];
    this.list = [];
    if (this.taxes.type === 'DETAILED' && this.taxes.reducedTaxes) {
      this.headers.push("Invoice");
      this.headers.push("Date");
      this.headers = [...this.headers, ...this.taxes.taxesLabels];
      this.headers.push("Total Sales");
      this.taxes.lines.forEach(line => {
        let list = [];
        list.push(`#${line.invoiceNumber}`);
        list.push(`${line.date}`);
        this.taxes.taxesLabels.forEach(label => {
          list.push(`$${this.parseTotal(line.taxes[label] || 0)}`);
        })
        list.push(`$${this.parseTotal(line.invoiceSum)}`);
        this.list.push(list);
      })
      let list = [];
      for (let i = 0; i < this.list[0].length - Object.keys(this.taxes.reducedTaxes).length - 1; i++) {
        list.push('');
      }
      this.taxes.taxesLabels.forEach(label => {
        list.push(`$${this.parseTotal(this.taxes.reducedTaxes[label])}`);

      })

      list.push(`$${this.parseTotal(this.taxes.totalTaxableSum)}`);
      this.list.push(list);
    } else {
      this.headers.push("Tax Description");
      this.headers.push("Taxable Amount");
      this.headers.push("Tax");
      this.taxes.lines.forEach(line => {
        let list = [];
        list.push(`${line.name}`);
        list.push(`$${this.parseTotal(line.taxableSum)}`);
        list.push(`$${this.parseTotal(line.taxSum)}`);
        this.list.push(list);
      })
      let list = [''];
      list.push(`$${this.parseTotal(this.taxes.totalTaxableSum)}`);
      list.push(`$${this.parseTotal(this.taxes.totalTaxSum)}`);
      this.list.push(list);
    }


  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
