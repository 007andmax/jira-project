import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsLinkedComponent } from './documents-linked.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [DocumentsLinkedComponent

    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        DropDownModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
    ],
    exports: [DocumentsLinkedComponent]



})
export class DocumentsLinkedModule { }
