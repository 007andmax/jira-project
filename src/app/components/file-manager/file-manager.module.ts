import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagementRoutingModule } from './file-manager-routing.module';
import { FileManagerCategoryComponent } from './file-manager-category/file-manager-category.component';
import { FileManagerHeaderComponent } from './file-manager-header/file-manager-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerItemFileComponent } from './file-manager-item-file/file-manager-item-file.component';
import { FileManagerItemCategoryComponent } from './file-manager-item-category/file-manager-item-category.component';
import { FileManagementItemCategoryModule } from './file-manager-item-category/file-manager-item-category.module';
import { FileManagementItemFileModule } from './file-manager-item-file/file-manager-item-file.module';
import { FileManagementHeaderModule } from './file-manager-header/file-manager-header.module';
import { FileManagerAddFileComponent } from './file-manager-add-file/file-manager-add-file.component';
import { FileManagementAddFileModule } from './file-manager-add-file/file-manager-add-file.module';
import { FileManagerAddCategoryComponent } from './file-manager-add-category/file-manager-add-category.component';
import { FileManagerCategoryRenameComponent } from './file-manager-category-rename/file-manager-category-rename.component';
import { FileManagerFileInfoComponent } from './file-manager-file-info/file-manager-file-info.component';
import { FileManagerFileInfoTagsComponent } from './file-manager-file-info/file-manager-file-info-tags/file-manager-file-info-tags.component';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { DblclickModule } from 'src/app/directives/dblclick/dblclick.module';
import { FileManagerAllCustomerComponent } from './file-manager-all-customer/file-manager-all-customer.component';
import { FileManagementFileInfoModule } from './file-manager-file-info/file-manager-file-info.module';
import { FileManagerAllCustomerCompanyComponent } from './file-manager-all-customer-company/file-manager-all-customer-company.component';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [FileManagerComponent, FileManagerCategoryRenameComponent,

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
        FileManagementHeaderModule,
        ReactiveFormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        TextAreaModule,
        KeyUpEnterModule,
        FileManagementFileInfoModule
    ],
    entryComponents: [
        FileManagerCategoryRenameComponent
    ]
})
export class FileManagementModule { }
