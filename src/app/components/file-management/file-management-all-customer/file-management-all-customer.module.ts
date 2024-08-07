import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagementAllCustomerComponent } from './file-management-all-customer.component';
import { FileManagementAllCustomerRoutingModule } from './file-management-all-customer-routing.module';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementHeaderModule } from '../file-management-header/file-management-header.module';
import { FileManagementItemCategoryModule } from '../file-management-item-category/file-management-item-category.module';
import { FileManagementFileInfoModule } from '../file-management-file-info/file-management-file-info.module';

@NgModule({
    declarations: [FileManagementAllCustomerComponent

    ],
    imports: [
        CommonModule,
        FileManagementAllCustomerRoutingModule,
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
        FileManagementFileInfoModule
    ],
})
export class FileManagementAllCustomerModule { }
