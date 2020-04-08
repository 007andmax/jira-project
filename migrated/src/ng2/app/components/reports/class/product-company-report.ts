import { ProductSalesReport } from './product-sales-report';
import { Overlay } from '@angular/cdk/overlay';
import { reqCompanyProduct } from 'src/ng2/app/interfaces/reports/req-company-products';
import { ProductCompanyReportLine } from './product-company-report-line';

export class ProductCompanyReport extends ProductSalesReport {
  serialNumber: string = "";
  lines: Array<ProductCompanyReportLine> = [];
  public getForRequest() {
    let data: reqCompanyProduct = {
      type: this.type.toUpperCase(),
      startDate: this.startDate,
      endDate: this.endDate,
      productId: this.productId,
      companyId: this.companyId
    }
    if (this.serialNumber.length > 0) data.serialNumber = this.serialNumber;
    return data;

  }
  public setData(data) {
    this.techCompanyName = data.techCompanyName;
    this.clientCompanyName = data.clientCompanyName;
    this.productName = data.productName;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.type = data.type;
    this.lines = data.lines.map((item) => {
      return new ProductCompanyReportLine(item);
    })
    this.purchaseCostSum = data.purchaseCostSum;
    this.salePriceSum = data.salePriceSum;
    this.discountSum = data.discountSum;

  }
}