import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuoteAsidePreviewBodyComponent } from './quote-aside-preview-body/quote-aside-preview-body.component';
import { QuoteAsidePreviewComponent } from './quote-aside-preview.component';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { QuoteAsidePreviewBodyModule } from './quote-aside-preview-body/quote-aside-preview-body.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule,
        QuoteAsidePreviewBodyModule,
        QuoteAsidePreviewComponent
    ],
    exports: [QuoteAsidePreviewComponent]
})
export class QuoteAsidePreviewModule { }
