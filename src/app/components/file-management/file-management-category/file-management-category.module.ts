import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementCategoryRoutingModule } from './file-management-category-routing.module';
import { FileManagementCategoryComponent } from './file-management-category.component';
import { FileManagementItemCategoryModule } from '../file-management-item-category/file-management-item-category.module';
import { FileManagementItemFileModule } from '../file-management-item-file/file-management-item-file.module';
import { FileManagementHeaderModule } from '../file-management-header/file-management-header.module';

@NgModule({
    declarations: [FileManagementCategoryComponent

    ],
    imports: [
        CommonModule,
        FileManagementCategoryRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementItemFileModule,
        FileManagementHeaderModule
    ],
})
export class FileManagementCategoryModule { }
