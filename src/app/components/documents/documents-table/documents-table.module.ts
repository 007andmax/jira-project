import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsTableComponent } from './documents-table.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [DocumentsTableComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        NgbModule,
    ],
    exports: [DocumentsTableComponent]


})
export class DocumentsTableModule { }
