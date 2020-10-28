import { QuoteValdiate } from './quote-vildate';

export class QuoteValdiateEdit extends QuoteValdiate {

    public isValidate(quote) {
        if (quote.services.length === 0 && quote.products.length === 0) this.servicesProducts = false;
        if (quote.products.find(item => !item.validateSaleCost)) {
            this.validateSaleCostProduct = false;
        } else {
            this.validateSaleCostProduct = true;
        }
        return this.company && this.servicesProducts && this.validateSaleCostProduct;
    }
}