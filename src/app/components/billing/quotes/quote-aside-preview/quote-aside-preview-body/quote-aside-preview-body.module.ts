import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { QuoteAsidePreviewBodyComponent } from './quote-aside-preview-body.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule,
        QuoteAsidePreviewBodyComponent
    ],
    exports: [QuoteAsidePreviewBodyComponent]
})
export class QuoteAsidePreviewBodyModule { }
