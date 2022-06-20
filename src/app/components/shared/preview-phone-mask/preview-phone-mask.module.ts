import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreviewPhoneMaskComponent } from './preview-phone-mask.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        PreviewPhoneMaskComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [PreviewPhoneMaskComponent],


})
export class PreviewPhoneMaskModule { }
