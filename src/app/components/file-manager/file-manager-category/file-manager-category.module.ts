import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementCategoryRoutingModule } from './file-manager-category-routing.module';
import { FileManagerCategoryComponent } from './file-manager-category.component';
import { FileManagementItemCategoryModule } from '../file-manager-item-category/file-manager-item-category.module';
import { FileManagementItemFileModule } from '../file-manager-item-file/file-manager-item-file.module';
import { FileManagementHeaderModule } from '../file-manager-header/file-manager-header.module';
import { FileManagementFileInfoModule } from '../file-manager-file-info/file-manager-file-info.module';

@NgModule({
    declarations: [FileManagerCategoryComponent

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
        FileManagementHeaderModule,
        FileManagementFileInfoModule
    ],
})
export class FileManagementCategoryModule { }
