import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerAddFileComponent } from './file-manager-add-file.component';
import { FileManagementAddFileDragDropComponent } from './file-manager-add-file-drag-drop/file-manager-add-file-drag-drop.component';
import { UploadAreaProgressModule } from '../../shared/upload-area/upload-area-progress/upload-area-progress.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { FileManagerAddFileTagsComponent } from './file-manager-add-file-tags/file-manager-add-file-tags.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DndModule } from 'src/app/directives/dnd/dnd.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';

@NgModule({
    declarations: [FileManagerAddFileComponent, FileManagementAddFileDragDropComponent, FileManagerAddFileTagsComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        UploadAreaProgressModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        DatePickerModule,
        CompanyTagsModule,
        InfiniteScrollModule,
        DndModule,
        ReactiveFormsModule,
        TextAreaModule,
        MatErrorModule
    ],
    entryComponents: [FileManagerAddFileComponent],
    exports: [FileManagerAddFileComponent]
})
export class FileManagementAddFileModule { }
