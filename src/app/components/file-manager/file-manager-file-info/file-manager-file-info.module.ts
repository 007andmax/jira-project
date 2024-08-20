import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerFileInfoTagsComponent } from './file-manager-file-info-tags/file-manager-file-info-tags.component';
import { FileManagerFileInfoComponent } from './file-manager-file-info.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';

@NgModule({
    declarations: [FileManagerFileInfoTagsComponent, FileManagerFileInfoComponent

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
        InfiniteScrollModule,
        KeyUpEnterModule
    ],
    exports: [FileManagerFileInfoComponent]
})
export class FileManagementFileInfoModule { }
