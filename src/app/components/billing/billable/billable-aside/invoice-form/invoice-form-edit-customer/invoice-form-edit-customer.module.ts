import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { NgxMaskModule } from 'ngx-mask';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [InvoiceFormEditCustomerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        NgxMaskModule.forRoot(),
        MatErrorModule
    ],
    exports: [InvoiceFormEditCustomerComponent]



})
export class InvoiceFormEditCustomerModule { }
