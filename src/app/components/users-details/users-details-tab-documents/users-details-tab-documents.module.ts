import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersDetailsTabDocumentsItemComponent } from './users-details-tab-documents-item/users-details-tab-documents-item.component';
import { UsersDetailsTabDocumentsComponent } from './users-details-tab-documents.component';
import { DocumentsTemplatesInfoModule } from '../../documents/documents-templates/documents-templates-info/documents-templates-info.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [UsersDetailsTabDocumentsComponent,
    UsersDetailsTabDocumentsItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DocumentsTemplatesInfoModule,
    NgbModule
  ],
  exports: [UsersDetailsTabDocumentsComponent]
})
export class UsersDetailsTabDocumentsModule { }
