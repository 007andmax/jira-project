import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsLinkedComponent } from './documents-linked.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';


@NgModule({
    declarations: [DocumentsLinkedComponent

    ],
    imports: [
        CommonModule,
        DropDownModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule
    ],
    exports: [DocumentsLinkedComponent]



})
export class DocumentsLinkedModule { }
