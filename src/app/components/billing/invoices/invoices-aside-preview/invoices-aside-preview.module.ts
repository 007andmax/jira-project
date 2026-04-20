import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesAsidePreviewComponent } from './invoices-aside-preview.component';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    imports: [
    CommonModule,
    PreviewPhoneMaskModule,
    NgbModule,
    InvoicesAsidePreviewComponent,
],
    exports: [InvoicesAsidePreviewComponent]
})
export class InvoicesAsidePreviewModule { }
