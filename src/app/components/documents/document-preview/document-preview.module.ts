import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPreviewComponent } from './document-preview.component';
import { DocumentPreviewRoutingModule } from './document-preview-routing.module';


@NgModule({
    declarations: [DocumentPreviewComponent

    ],
    imports: [
        CommonModule,
        DocumentPreviewRoutingModule

    ],



})
export class DocumentPreviewModule { }
