import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagementComponent } from './file-management.component';
import { FormsModule } from '@angular/forms';
import { FileManagementRoutingModule } from './file-management-routing.module';
import { FileManagementCategoryComponent } from './file-management-category/file-management-category.component';
import { FileManagementHeaderComponent } from './file-management-header/file-management-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementItemFileComponent } from './file-management-item-file/file-management-item-file.component';
import { FileManagementItemCategoryComponent } from './file-management-item-category/file-management-item-category.component';
import { FileManagementItemCategoryModule } from './file-management-item-category/file-management-item-category.module';
import { FileManagementItemFileModule } from './file-management-item-file/file-management-item-file.module';
import { FileManagementHeaderModule } from './file-management-header/file-management-header.module';
import { FileManagementAddFileComponent } from './file-management-add-file/file-management-add-file.component';

@NgModule({
    declarations: [FileManagementComponent, FileManagementAddFileComponent

    ],
    imports: [
        CommonModule,
        FileManagementRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementItemFileModule,
        FileManagementHeaderModule
    ],
})
export class FileManagementModule { }
