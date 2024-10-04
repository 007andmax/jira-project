import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerAllCustomerComponent } from './file-manager-all-customer.component';
import { FileManagementAllCustomerRoutingModule } from './file-manager-all-customer-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementHeaderModule } from '../file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from '../file-manager-item-category/file-manager-item-category.module';
import { FileManagementFileInfoModule } from '../file-manager-file-info/file-manager-file-info.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';

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
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        TextAreaModule,
        KeyUpEnterModule,
        FileManagementFileInfoModule
    ],
})
export class FileManagementAllCustomerModule { }
