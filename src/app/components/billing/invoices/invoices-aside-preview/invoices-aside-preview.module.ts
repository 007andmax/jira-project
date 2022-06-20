import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesAsidePreviewComponent } from './invoices-aside-preview.component';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';



@NgModule({
    declarations: [InvoicesAsidePreviewComponent
    ],
    imports: [
        CommonModule,
        PreviewPhoneMaskModule
    ],
    exports: [InvoicesAsidePreviewComponent]
})
export class InvoicesAsidePreviewModule { }
