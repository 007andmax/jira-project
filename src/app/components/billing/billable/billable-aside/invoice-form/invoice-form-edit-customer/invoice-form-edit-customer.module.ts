import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';


@NgModule({
    declarations: [InvoiceFormEditCustomerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        DropDownModule,
    ],
    exports: [InvoiceFormEditCustomerComponent]



})
export class InvoiceFormEditCustomerModule { }
