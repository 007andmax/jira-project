import { QuoteAdd } from './quote-add';

export class QuoteValdiate {
    number: boolean = true;
    company: boolean = true;
    servicesProducts: boolean = true;
    validateSaleCostProduct: boolean = true;
    validate: boolean = true;
    validateServices: boolean = true;
    errorMessage: string = "";
    constructor() { }

    public resetNumber() {
        this.number = true;
    }
    public getNumber() {
        return this.number;
    }
    public getValidate() {
        return this.validate;
    }
    public resetValidate() {
        this.validate = true;
    }
    public setErrorMessage(data) {
        this.errorMessage = data;
        this.validate = false;
    }
    public getCompany() {
        return this.company;
    }
    public getServicesProducts() {
        return this.servicesProducts;
    }
    public resetServicesProducts() {
        this.servicesProducts = true;
    }
    public resetCompany() {
        this.company = true;
    }
    public isValidate(quote) {
        if (quote.services.find(item => !item.validate)) this.validateServices = false;
        if (quote.number.length === 0) this.number = false;
        if (!quote.companyId) this.company = false;
        if (quote.services.length === 0 && quote.products.length === 0) this.servicesProducts = false;
        if (quote.products.find(item => !item.validateSaleCost)) {
            this.validateSaleCostProduct = false;
        } else {
            this.validateSaleCostProduct = true;
        }
        return this.company && this.servicesProducts && this.validateSaleCostProduct && this.number && this.validateServices;
    }
}