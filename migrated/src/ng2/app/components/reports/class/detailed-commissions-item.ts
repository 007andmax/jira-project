export class DetailedCommissionsItem {
    agreementId: string;
    agreementType: string;
    billableQuantity: string;
    commissionRate: number;
    commissionSum: number;
    companyName: string;
    exceededCommissionRateApplied: boolean;
    expenseBasedOnDefault: boolean;
    expenseFromOtherTypeContract: boolean;
    expenseName: string;
    productCategory: string;
    productCost: number;
    productPrice: number;
    productsSum: number;
    serviceAgreementDescription: string;
    servicesSum: number;
    totalSum: number;
    itemGroup: string;
    constructor(data) {
        this.agreementId = data.agreementId;
        this.agreementType = data.agreementType;
        this.billableQuantity = data.billableQuantity;
        this.commissionRate = data.commissionRate;
        this.commissionSum = data.commissionSum;
        this.companyName = data.companyName;
        this.exceededCommissionRateApplied = data.exceededCommissionRateApplied;
        this.expenseBasedOnDefault = data.expenseBasedOnDefault;
        this.expenseFromOtherTypeContract = data.expenseFromOtherTypeContract;
        this.expenseName = data.expenseName;
        this.productCategory = data.productCategory;
        this.productCost = data.productCost;
        this.productPrice = data.productPrice || data.totalSum / data.billableQuantity;
        this.productsSum = data.productsSum;
        this.serviceAgreementDescription = data.serviceAgreementDescription;
        this.servicesSum = data.servicesSum;
        this.totalSum = data.totalSum;
        this.itemGroup = data.productCategory || this.normalizeString(data.agreementType);
    }
    normalizeString(str) {
        if (!str) return str;
        str = str.split('_');
        str = str.map(function (el) {
            return el[0].toUpperCase() + el.slice(1).toLowerCase();
        });

        return str.join(' ');
    }
}