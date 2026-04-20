import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddComponent } from './documents-add.component';

import { DocumentsAddBodyModule } from './documents-add-body/documents-add-body.module';

import { DocumentsAddInfoComponent } from './documents-add-info/documents-add-info.component';
import { FormsModule } from '@angular/forms';






import { DocumentsAddRoutingModule } from './documents-add-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    imports: [
    CommonModule,
    DocumentsAddBodyModule,
    FormsModule,
    DocumentsAddRoutingModule,
    NgbModule,
    DocumentsAddComponent,
    DocumentsAddInfoComponent
],
})
export class DocumentsAddModule { }
