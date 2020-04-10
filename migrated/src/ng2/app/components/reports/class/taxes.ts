import { TaxesReportLine } from './taxes-line';
import { reqTaxesReport } from 'src/ng2/app/interfaces/reports/req-taxes-report';

export class TaxesReport {
  techCompanyName: string;
  clientCompanyName: string;
  startDate: string;
  endDate: string;
  type: string = 'Summary';
  lines: Array<TaxesReportLine> = [];
  reducedTaxes: any;
  taxesLabels = [];
  totalSaleSum: number;
  totalTaxableSum: number;
  totalTaxSum: number;

  public setData(data) {
    this.techCompanyName = data.techCompanyName;
    this.clientCompanyName = data.clientCompanyName;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.type = data.type;
    this.lines = data.lines.map((item) => {
      return new TaxesReportLine(item);
    })
    this.reducedTaxes = data.reducedTaxes;
    if (this.type === 'DETAILED') {
      let labels = [];
      if (this.reducedTaxes) {
        Object.keys(this.reducedTaxes).forEach((key) => {
          labels.push(key);
        });
      }
      this.taxesLabels = labels;
    } else {
      this.taxesLabels = [];
    }

    this.totalSaleSum = data.totalSaleSum;
    this.totalTaxableSum = data.totalTaxableSum;
    this.totalTaxSum = data.totalTaxSum;
  }
  public setStartDate(startDate) {
    this.startDate = startDate;
  };
  public setEndDate(endDate) {
    this.endDate = endDate;
  };
  public setType(data) {
    this.type = data;
  }
  public getForRequest() {
    let data: reqTaxesReport = {
      type: this.type.toUpperCase(),
      startDate: this.startDate,
      endDate: this.endDate,

    }
    return data;

  }

}
