import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAreaComponent } from './upload-area.component';
import { UploadAreaProgressModule } from './upload-area-progress/upload-area-progress.module';
import { DndModule } from 'src/app/directives/dnd/dnd.module';




@NgModule({
    declarations: [UploadAreaComponent
    ],
    imports: [
        CommonModule,
        UploadAreaProgressModule,
        DndModule
    ],
    exports: [UploadAreaComponent]



})
export class UploadAreaModule { }
