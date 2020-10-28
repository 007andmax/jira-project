import { QuoteAdd } from './quote-add';

export class QuoteValdiate {
    company: boolean = true;
    servicesProducts: boolean = true;
    validateSaleCostProduct:boolean = true;
    validate:boolean = true;
    errorMessage:string = "";
    constructor() { }

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
    public resetServicesProducts () {
        this.servicesProducts = true;
    }
    public resetCompany() {
        this.company = true;
    }
    public isValidate(quote) {
        if (!quote.companyId) this.company = false;
        if (quote.services.length === 0 && quote.products.length === 0) this.servicesProducts = false;
        if (quote.products.find(item => !item.validateSaleCost)) {
            this.validateSaleCostProduct = false;
        } else {
            this.validateSaleCostProduct = true;
        }
        return this.company && this.servicesProducts && this.validateSaleCostProduct;
    }
}