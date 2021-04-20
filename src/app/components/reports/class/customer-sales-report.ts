import { CustomerSalesReportLine } from './customer-sales-report-line';
import { reqSalesByCustomer } from 'src/app/interfaces/reports/req-sales-by-customer';

export class CustomerSalesReport {
    companyId: string;
    techCompanyName: string;
    clientCompanyName: string;
    startDate: string = '';
    endDate: string = '';
    type: string = 'Summary';
    productsSum: number;
    servicesSum: number;
    totalSum: number;
    lines: Array<CustomerSalesReportLine> = [];

    public setData(data) {
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.type = data.type;
        this.lines = (data.lines) ? data.lines.map((item) => {
            return new CustomerSalesReportLine(item);
        }) : [];
        this.productsSum = data.productsSum;
        this.servicesSum = data.servicesSum;
        this.totalSum = data.totalSum;

    }

    public getForRequest() {
        let data: reqSalesByCustomer = {
            type: this.type.toUpperCase(),
            startDate: this.startDate,
            endDate: this.endDate,
            companyId: this.companyId,
        }
        return data;

    }
    public setType(data) {
        this.type = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
}