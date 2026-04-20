import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyAddAsideComponent } from './company-add-aside.component';
import { CompanyAddAsideShortComponent } from './company-add-aside-short/company-add-aside-short.component';
import { CompanyAddAsideFullComponent } from './company-add-aside-full/company-add-aside-full.component';
import { FormsModule } from '@angular/forms';






import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';




import { ProductListQuoteComponent } from '../../billing/quotes/quote-aside-add/product-list-quote/product-list-quote.component';





@NgModule({
    declarations: [CompanyAddAsideComponent,
        CompanyAddAsideShortComponent,
        CompanyAddAsideFullComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxMaskModule.forRoot()
],
    exports: [CompanyAddAsideComponent]



})
export class CompanyAddAsideModule { }
