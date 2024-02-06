import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsTemplatesInfoComponent } from './documents-templates-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [DocumentsTemplatesInfoComponent
    ],
    imports: [
        CommonModule,
        NgbModule

    ],
    exports: [DocumentsTemplatesInfoComponent]


})
export class DocumentsTemplatesInfoModule { }
