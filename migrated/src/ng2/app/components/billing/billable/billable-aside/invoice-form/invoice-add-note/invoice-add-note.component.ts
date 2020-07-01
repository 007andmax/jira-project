import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceNote } from '../../../class/invoice-note';
import { NoteService } from 'src/ng2/app/services/note/note.service';
import { InvoiceAddNoteValidate } from './class/invoice-add-note-validate';

@Component({
  selector: 'app-invoice-add-note',
  templateUrl: './invoice-add-note.component.html',
  styleUrls: ['./invoice-add-note.component.scss']
})
export class InvoiceAddNoteComponent implements OnInit {
  @Input() dropDown: NgbDropdown;
  @Output() onUpdateNotes = new EventEmitter<any>();
  createNote: InvoiceNote = new InvoiceNote();
  validate: InvoiceAddNoteValidate = new InvoiceAddNoteValidate();
  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.createNote.setDefault();
  }
  add() {
    if (!this.validate.isValidate(this.createNote)) return;
    this.noteService.createNote([this.createNote]).subscribe(data => {
      this.onUpdateNotes.emit(null);
      this.close();
    })
  }
  close() {
    this.dropDown.close();
    this.createNote.setDefault();
  }
}
