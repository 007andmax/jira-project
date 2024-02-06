import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPreviewComponent } from './document-preview.component';
import { DocumentPreviewRoutingModule } from './document-preview-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [DocumentPreviewComponent

    ],
    imports: [
        CommonModule,
        DocumentPreviewRoutingModule,
        NgbModule

    ],



})
export class DocumentPreviewModule { }
