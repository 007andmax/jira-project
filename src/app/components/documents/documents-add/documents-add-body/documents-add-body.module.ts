import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddBodyComponent } from './documents-add-body.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';



@NgModule({
    declarations: [DocumentsAddBodyComponent,


    ],
    imports: [
        CommonModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()
    ],
    exports: [DocumentsAddBodyComponent]


})
export class DocumentsAddBodyModule { }
