import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatChipsModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import { ModalQuoteComponent } from './modal-quote.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';



@NgModule({
    declarations: [ModalQuoteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        NgbModule,
        TextAreaModule,
        ReactiveFormsModule

    ],
    entryComponents: [ModalQuoteComponent],
    exports: [ModalQuoteComponent]


})
export class ModalQuoteModule { }
