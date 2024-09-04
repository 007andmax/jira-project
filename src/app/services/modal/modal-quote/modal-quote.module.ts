import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalQuoteComponent } from './modal-quote.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';



@NgModule({
    declarations: [ModalQuoteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        NgbModule,
        TextAreaModule,
        ReactiveFormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,

    ],
    entryComponents: [ModalQuoteComponent],
    exports: [ModalQuoteComponent]


})
export class ModalQuoteModule { }
