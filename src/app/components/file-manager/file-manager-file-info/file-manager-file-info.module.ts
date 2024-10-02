import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerFileInfoTagsComponent } from './file-manager-file-info-tags/file-manager-file-info-tags.component';
import { FileManagerFileInfoComponent } from './file-manager-file-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';

@NgModule({
    declarations: [FileManagerFileInfoTagsComponent, FileManagerFileInfoComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        TextAreaModule,
        InfiniteScrollModule,
        KeyUpEnterModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule
    ],
    exports: [FileManagerFileInfoComponent]
})
export class FileManagementFileInfoModule { }
