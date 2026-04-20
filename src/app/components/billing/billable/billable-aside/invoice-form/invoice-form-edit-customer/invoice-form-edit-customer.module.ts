import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer.component';
import { FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';



@NgModule({
    declarations: [InvoiceFormEditCustomerComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot()
],
    exports: [InvoiceFormEditCustomerComponent]



})
export class InvoiceFormEditCustomerModule { }
