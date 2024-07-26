import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementHeaderComponent } from './file-management-header.component';
import { FileManagementAddCategoryComponent } from '../file-management-add-category/file-management-add-category.component';
import { MatFormFieldModule } from '@angular/material';

@NgModule({
    declarations: [FileManagementHeaderComponent,
        FileManagementAddCategoryComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        ReactiveFormsModule,
        MatFormFieldModule,
    ],
    exports: [FileManagementHeaderComponent]
})
export class FileManagementHeaderModule { }
