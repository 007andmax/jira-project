import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsLinkedComponent } from './documents-linked.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
