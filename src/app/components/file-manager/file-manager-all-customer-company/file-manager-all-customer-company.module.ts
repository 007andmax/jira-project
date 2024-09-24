import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementHeaderModule } from '../file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from '../file-manager-item-category/file-manager-item-category.module';
import { FileManagementFileInfoModule } from '../file-manager-file-info/file-manager-file-info.module';
import { FileManagerAllCustomerCompanyComponent } from './file-manager-all-customer-company.component';
import { FileManagementAllCustomerCompanyRoutingModule } from './file-manager-all-customer-company-routing.module';
import { FileManagementItemFileModule } from '../file-manager-item-file/file-manager-item-file.module';

@NgModule({
    declarations: [FileManagerAllCustomerCompanyComponent

    ],
    imports: [
        CommonModule,
        FileManagementAllCustomerCompanyRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementHeaderModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        TextAreaModule,
        KeyUpEnterModule,
        FileManagementFileInfoModule,
        FileManagementItemFileModule
    ],
})
export class FileManagementAllCustomerCompanyModule { }
