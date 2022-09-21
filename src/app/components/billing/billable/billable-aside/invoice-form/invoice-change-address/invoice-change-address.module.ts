import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceChangeAddressComponent } from './invoice-change-address.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';


@NgModule({
    declarations: [InvoiceChangeAddressComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule
    ],
    exports: [InvoiceChangeAddressComponent]


})
export class InvoiceChangeAddressModule { }
