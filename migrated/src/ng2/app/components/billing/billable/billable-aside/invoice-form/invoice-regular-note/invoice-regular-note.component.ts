import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { InvoiceNote } from '../../../class/invoice-note';
import { PartialUpdate } from '../class/partial-update';
import { NoteService } from 'src/ng2/app/services/note/note.service';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';

@Component({
  selector: 'app-invoice-regular-note',
  templateUrl: './invoice-regular-note.component.html',
  styleUrls: ['./invoice-regular-note.component.scss']
})
export class InvoiceRegularNoteComponent implements OnInit {
  @Input() invoiceNotes: Array<InvoiceNote> = [];
  @Output() onUpdateInvoiceData = new EventEmitter();
  selectedNote: InvoiceNote = null;
  toogleCustomerNote: boolean = false;
  regularNotes: Array<InvoiceNote> = [];
  changeRegularNote: boolean = false;
  constructor(private noteService: NoteService,
    private billableService: BillableService,
    private elRef: ElementRef,) { }

  ngOnInit() {
    this.regularNotes = this.invoiceNotes.filter(item => item.noteType === "REGULAR");
  }
  getLenRegularNotes() {
    return this.invoiceNotes.filter(item => item.noteType === "REGULAR").length;
  }
  onCheckUpdateTitleNote(data) {
    if (this.selectedNote) {
      this.changeRegularNote = true;
      this.selectedNote.title = data;
      console.log("data", data);
    }

  }
  onSetRegularNote(data) {
    console.log("data", data);
    this.selectedNote.title = data;
    this.changeRegularNote = true;
  }
  onCheckUpdateDescriptionNote() {
    if (this.selectedNote) this.changeRegularNote = true;

  }
  onUpdateRegularNote() {
    this.noteService.updateNote({ "title": this.selectedNote.title, "line1": this.elRef.nativeElement.querySelector("#description-regular-note").value, "line2": "" }, this.selectedNote.id).subscribe(data => {
      this.changeRegularNote = false;
    })
  }
  onChangeDescriptionNote() {
    let request: PartialUpdate = new PartialUpdate(null, null, null, this.selectedNote, null);
    console.log("request", request);
    this.onUpdateInvoiceData.emit(request);
  }

  onChangeRegularNote() {
    console.log("onChangeRegularNote");
    if (this.selectedNote) {
      let selectedNote = JSON.parse(JSON.stringify(this.selectedNote));
      selectedNote.line1 = this.elRef.nativeElement.querySelector("#description-regular-note").value;
      let request: PartialUpdate = new PartialUpdate(null, null, null, selectedNote, null);
      console.log("request", request);
      this.onUpdateInvoiceData.emit(request);

    } else {
      let selectedNote = new InvoiceNote({
        line1: this.elRef.nativeElement.querySelector("#description-regular-note").value,
        line2: "",
        noteType: "REGULAR",
        suggestedNote: false,
      });
      let request: PartialUpdate = new PartialUpdate(null, null, null, selectedNote, null);
      console.log("request", request);
      this.onUpdateInvoiceData.emit(request);

    }

  }
  onSelectNotes(data) {
    this.selectedNote = data;
    console.log("selectedNote", this.selectedNote);
    if (this.selectedNote) {
      let request: PartialUpdate = new PartialUpdate(null, null, null, this.selectedNote, null);
      console.log("request", request);
      this.onUpdateInvoiceData.emit(request);
      this.elRef.nativeElement.querySelector("#description-regular-note").value = this.selectedNote.line1;

    } else {
      this.changeRegularNote = false;
      this.elRef.nativeElement.querySelector("#description-regular-note").value = "";
    }
  }
  getInvoiceNote() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.invoiceNotes = data;
      this.regularNotes = this.invoiceNotes.filter(item => item.noteType === "REGULAR");
      console.log("regularNotes", this.regularNotes);
    })
  }
}
