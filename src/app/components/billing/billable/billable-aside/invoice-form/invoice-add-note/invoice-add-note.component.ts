import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceNote } from '../../../class/invoice-note';
import { NoteService } from 'src/app/services/note/note.service';
import { InvoiceAddNoteValidate } from './class/invoice-add-note-validate';
import { ValidateNote } from 'src/app/components/setting/accounting/custom-notes-settings/class/validate-note';
import { BillableService } from 'src/app/services/billable/billable.service';
import { FormsModule } from '@angular/forms';
import { MatErrorComponent } from '../../../../../shared/mat-error/mat-error.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-invoice-add-note',
    templateUrl: './invoice-add-note.component.html',
    styleUrls: ['./invoice-add-note.component.scss'],
    standalone: true,
    imports: [NgIf, MatErrorComponent, FormsModule, NgClass]
})
export class InvoiceAddNoteComponent implements OnInit {
  @Input() dropDown: NgbDropdown;
  @Output() onUpdateNotes = new EventEmitter<any>();
  createNote: InvoiceNote = new InvoiceNote();
  validate: ValidateNote = new ValidateNote();
  constructor(private billableService: BillableService) { }

  ngOnInit() {

  }
  add() {
    if (!this.validate.isValidate(this.createNote)) return;
    this.billableService.addNote(this.createNote.getDataForAdd()).subscribe(data => {
      this.onUpdateNotes.emit(null);
      this.close();
    })
  }
  close() {
    this.createNote = new InvoiceNote();
    this.dropDown.close();
  }
}
