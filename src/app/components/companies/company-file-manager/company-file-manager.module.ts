import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { FileManagementFileInfoModule } from '../../file-manager/file-manager-file-info/file-manager-file-info.module';
import { FileManagementHeaderModule } from '../../file-manager/file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from '../../file-manager/file-manager-item-category/file-manager-item-category.module';
import { FileManagementItemFileModule } from '../../file-manager/file-manager-item-file/file-manager-item-file.module';
import { FileManagementRoutingModule } from '../../file-manager/file-manager-routing.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { CompanyFileManagerComponent } from './company-file-manager.component';
import { CompanyFileManagerRoutingModule } from './company-file-manager-routing.module';

@NgModule({
    declarations: [CompanyFileManagerComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementItemFileModule,
        FileManagementHeaderModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        TextAreaModule,
        KeyUpEnterModule,
        FileManagementFileInfoModule,
        CompanyFileManagerRoutingModule
    ],

})
export class CompanyFileManagerModule { }
