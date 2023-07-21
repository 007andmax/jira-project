import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer.component';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
    declarations: [InvoiceFormEditCustomerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        DropDownModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [InvoiceFormEditCustomerComponent]



})
export class InvoiceFormEditCustomerModule { }
