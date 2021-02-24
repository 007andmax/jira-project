import { DetailedCommissionsItem } from "./detailed-commissions-item";
import { DetailedCommissionsReducedCompanies } from "./detailed-commissions-reduced-company";
import { DetailedCommissionsReport } from "./detailed-commissions-report";

export class CommonCommissionsReport extends DetailedCommissionsReport {
    type: string = "SUMMARY";

    public setData(data) {

        this.categorySalesValue = data.categorySalesValue;
        this.clientCompanyName = data.clientCompanyName;

        this.lines = data.lines.map(item => new DetailedCommissionsItem(item));
        this.productsSum = data.productsSum;
        this.servicesSum = data.servicesSum;

        this.techCompanyName = data.techCompanyName;
        this.totalCommissionSum = data.totalCommissionSum;
        this.totalSum = data.totalSum;


    }
}