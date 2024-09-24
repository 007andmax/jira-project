import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerHeaderComponent } from './file-manager-header.component';
import { FileManagerAddCategoryComponent } from '../file-manager-add-category/file-manager-add-category.component';
import { MatFormFieldModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { FileManagerAddCategoryModule } from '../file-manager-add-category/file-manager-add-category.module';

@NgModule({
    declarations: [FileManagerHeaderComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        DropDownModule,
        FileManagerAddCategoryModule
    ],
    exports: [FileManagerHeaderComponent]
})
export class FileManagementHeaderModule { }
