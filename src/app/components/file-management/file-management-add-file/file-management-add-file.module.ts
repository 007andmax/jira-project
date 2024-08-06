import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementAddFileComponent } from './file-management-add-file.component';
import { FileManagementAddFileDragDropComponent } from './file-management-add-file-drag-drop/file-management-add-file-drag-drop.component';
import { UploadAreaProgressModule } from '../../shared/upload-area/upload-area-progress/upload-area-progress.module';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { FileManagementAddFileTagsComponent } from './file-management-add-file-tags/file-management-add-file-tags.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DndModule } from 'src/app/directives/dnd/dnd.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';

@NgModule({
    declarations: [FileManagementAddFileComponent, FileManagementAddFileDragDropComponent, FileManagementAddFileTagsComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        UploadAreaProgressModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        DatePickerModule,
        CompanyTagsModule,
        InfiniteScrollModule,
        DndModule,
        ReactiveFormsModule,
        TextAreaModule
    ],
    entryComponents: [FileManagementAddFileComponent],
    exports: [FileManagementAddFileComponent]
})
export class FileManagementAddFileModule { }
