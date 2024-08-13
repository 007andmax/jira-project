import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementHeaderModule } from '../file-management-header/file-management-header.module';
import { FileManagementItemCategoryModule } from '../file-management-item-category/file-management-item-category.module';
import { FileManagementFileInfoModule } from '../file-management-file-info/file-management-file-info.module';
import { FileManagementAllCustomerCompanyComponent } from './file-management-all-customer-company.component';
import { FileManagementAllCustomerCompanyRoutingModule } from './file-management-all-customer-company-routing.module';
import { FileManagementItemFileModule } from '../file-management-item-file/file-management-item-file.module';

@NgModule({
    declarations: [FileManagementAllCustomerCompanyComponent

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
