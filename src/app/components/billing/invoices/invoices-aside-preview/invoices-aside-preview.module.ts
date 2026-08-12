import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesAsidePreviewComponent } from './invoices-aside-preview.component';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceDiscountPreivewModule } from '../../billable/billable-aside/invoice-form/invoice-discount-preivew/invoice-regular-note.module';



@NgModule({
    declarations: [InvoicesAsidePreviewComponent
    ],
    imports: [
        CommonModule,
        PreviewPhoneMaskModule,
        DynamicTooltipModule,
        NgbModule,
        InvoiceDiscountPreivewModule
    ],
    exports: [InvoicesAsidePreviewComponent]
})
export class InvoicesAsidePreviewModule { }
