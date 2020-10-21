import { Product } from 'src/ng2/app/interfaces/product/product'
import { Quote } from './quote'
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';

export class QuotePreview extends Quote {
    products: Array<QuoteProduct> = [];
    services: Array<QuoteService> = []
    termsAndConditions: string;
   
}