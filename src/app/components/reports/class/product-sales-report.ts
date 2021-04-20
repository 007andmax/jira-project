import { ProductSalesReportLine } from './product-sales-report-line';
import { reqSalesByProduct } from 'src/app/interfaces/reports/req-sales-by-product';
import * as moment from "moment";

export class ProductSalesReport {
    productId: string;
    companyId: string;
    techCompanyName: string;
    clientCompanyName: string;
    productName: string;
    startDate: string = '';
    endDate: string = '';
    type: string = 'Summary';
    lines: Array<ProductSalesReportLine> = [];
    purchaseCostSum: number;
    salePriceSum: number;
    discountSum: number;

    public setData(data) {
        this.techCompanyName = data.techCompanyName;
        this.clientCompanyName = data.clientCompanyName;
        this.productName = data.productName;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.type = data.type;
        this.lines = data.lines.map((item) => {
            return new ProductSalesReportLine(item);
        })
        this.purchaseCostSum = data.purchaseCostSum;
        this.salePriceSum = data.salePriceSum;
        this.discountSum = data.discountSum;

    }


    public getForRequest() {
        let data: reqSalesByProduct = {
            type: this.type.toUpperCase(),
            startDate: this.startDate,
            endDate: this.endDate,
            productId: this.productId,
            companyId: this.companyId,
        }
        return data;

    }

    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };

    public setCompanyId(data) {
        this.companyId = data;
    }

    public setProductId(data) {
        this.productId = data;
    }

    public setType(data) {
        this.type = data;
    }

    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
    public setDatesByCompany(selectedClient) {
        this.setStartDate(moment(selectedClient.createdAt).format('YYYY/MM/DD'));
        this.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
    }


}