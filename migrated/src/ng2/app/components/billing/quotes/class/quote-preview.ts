import { Product } from 'src/ng2/app/interfaces/product/product'
import { Quote } from './quote'
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';

export class QuotePreview extends Quote {
    products: Array<QuoteProduct> = [];
    services: Array<QuoteService> = []
    termsAndConditions: string;
    regularNote:any;
    message:string;
    constructor(data = null) {
        super();
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.products = data.products.map(item => new QuoteProduct(item));
            this.services = data.services.map(item => new QuoteService(item));

        }
    }
   
}