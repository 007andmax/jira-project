import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerAllCustomerComponent } from './file-manager-all-customer.component';
import { FileManagementAllCustomerRoutingModule } from './file-manager-all-customer-routing.module';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementHeaderModule } from '../file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from '../file-manager-item-category/file-manager-item-category.module';
import { FileManagementFileInfoModule } from '../file-manager-file-info/file-manager-file-info.module';

@NgModule({
    declarations: [FileManagerAllCustomerComponent

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
