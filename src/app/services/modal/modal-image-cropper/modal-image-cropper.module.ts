import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalImageCropperComponent } from './modal-image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
    declarations: [ModalImageCropperComponent
    ],
    imports: [
        CommonModule,
        ImageCropperModule

    ],
    exports: [ModalImageCropperComponent]


})
export class ModalImageCropperModule { }
