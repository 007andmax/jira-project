import { DetailedCommissionsItem } from "./detailed-commissions-item";
import { DetailedCommissionsReducedCompanies } from "./detailed-commissions-reduced-company";

export class DetailedCommissionsReport {
    companyId: string;
    userId: string;
    type: string = "DETAILED";
    startDate: string;
    endDate: string;
    reducedCompanies: Array<DetailedCommissionsReducedCompanies> = [];
    lines: Array<DetailedCommissionsItem> = [];

    categorySalesValue: any;
    clientCompanyName: string;

    productsSum: number;
    servicesSum: number;

    techCompanyName: string;
    totalCommissionSum: number;
    totalSum: number;
    priceSum: number;
    detailsByProducts: boolean = true;

    constructor(data = null) {
        if (data) {
            this.companyId = data.companyId;
            this.userId = data.userId;
            this.type = data.type;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.categorySalesValue = data.categorySalesValue;
            this.clientCompanyName = data.clientCompanyName;
            this.productsSum = data.productsSum;
            this.servicesSum = data.servicesSum;
            this.techCompanyName = data.techCompanyName;
            this.totalCommissionSum = data.totalCommissionSum;
            this.totalSum = data.totalSum;
            this.detailsByProducts = data.detailsByProducts;
            if (!this.detailsByProducts) {
                this.setDetailsByCustomer(data);
            } else {
                this.setLines(data.lines);
            }
            this.priceSum = this.lines.reduce((acc, el) => {
                acc += el.productPrice || 0;
                return acc;
            }, 0);
        }
    }
    public setData(data) {
        this.categorySalesValue = data.categorySalesValue;
        this.clientCompanyName = data.clientCompanyName;
        this.productsSum = data.productsSum;
        this.servicesSum = data.servicesSum;
        this.techCompanyName = data.techCompanyName;
        this.totalCommissionSum = data.totalCommissionSum;
        this.totalSum = data.totalSum;
        if (!this.detailsByProducts) {
            this.setDetailsByCustomer(data);
        } else {
            this.setLines(data.lines);
        }
        this.priceSum = this.lines.reduce((acc, el) => {
            acc += el.productPrice || 0;
            return acc;
        }, 0);

    }
    public setDetailsByCustomer(data) {
        this.lines = data.lines.map((el) => {
            if (el.agreementType === 'HOURLY') {
                el.firstLine = el.expenseName + ' - ' + 'Hourly' + ' - ' + el.serviceAgreementDescription;
            } else if (el.agreementType === 'BLOCK_TIME') {
                if (!el.exceededCommissionRateApplied) {
                    el.firstLine = el.expenseName + ' - ' + el.serviceAgreementDescription + (el.expenseBasedOnDefault ? '' : '- included hours');
                } else {
                    el.firstLine = el.expenseName + ' - ' + 'Block time' + ' - ' + el.serviceAgreementDescription + (el.expenseBasedOnDefault ? '' : ' - over hours');
                }
            } else if (el.agreementType === 'SERVICE_CONTRACT') {
                if (!el.exceededCommissionRateApplied) {
                    el.firstLine = el.expenseName + ' - ' + 'Service Contract' + ' - ' + el.serviceAgreementDescription;
                } else {
                    el.firstLine = el.expenseName + ' - ' + 'Service Contract' + ' - ' + el.serviceAgreementDescription + (el.expenseBasedOnDefault ? '' : ' - over hours');
                }

                if (el.expenseFromOtherTypeContract) {
                    el.firstLine = el.expenseName + ' - ' + 'Service Contract' + ' - by Other';
                }
            } else {
                el.firstLine = el.expenseName;
            }

            return new DetailedCommissionsItem(el);
        });


        this.setReducedCompanies();
    }
    public setDetailsByProducts(data) {
        this.detailsByProducts = data;
    }
    public setReducedCompanies() {
        this.reducedCompanies = [];
        this.lines.forEach(item => {
            let findCompany = this.reducedCompanies.findIndex(itemCompany => itemCompany.companyName === item.companyName);
            if (findCompany > -1) {
                this.reducedCompanies[findCompany].list.push(item);
                this.reducedCompanies[findCompany].calculate(item);
            } else {
                this.reducedCompanies.push(new DetailedCommissionsReducedCompanies());
                this.reducedCompanies[this.reducedCompanies.length - 1].list.push(item);
                this.reducedCompanies[this.reducedCompanies.length - 1].calculate(item);
            }
        })
    }
    public setLines(data) {
        this.lines = data.map(item => new DetailedCommissionsItem(item));

    }
    public getForRequest() {
        return {
            companyId: this.companyId,
            userId: this.userId,
            type: this.type,
            startDate: this.startDate,
            endDate: this.endDate,
        }
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setTechUserId(data) {
        this.userId = data;
    }
    public setStartDate(data) {
        this.startDate = data;
    }
    public setEndDate(data) {
        this.endDate = data;
    }
    public resetDates() {
        this.startDate = null;
        this.endDate = null;
    }
}