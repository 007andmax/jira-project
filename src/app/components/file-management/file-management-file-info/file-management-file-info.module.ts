import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagementFileInfoTagsComponent } from './file-management-file-info-tags/file-management-file-info-tags.component';
import { FileManagementFileInfoComponent } from './file-management-file-info.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [FileManagementFileInfoTagsComponent, FileManagementFileInfoComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        NgbModule,
        ReactiveFormsModule,
        TextAreaModule,
        InfiniteScrollModule
    ],
    exports: [FileManagementFileInfoComponent]
})
export class FileManagementFileInfoModule { }
