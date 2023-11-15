import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { InvoiceNote } from '../../../class/invoice-note';
import { PartialUpdate } from '../class/partial-update';
import { NoteService } from 'src/app/services/note/note.service';
import { BillableService } from 'src/app/services/billable/billable.service';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';

@Component({
  selector: 'app-invoice-regular-note',
  templateUrl: './invoice-regular-note.component.html',
  styleUrls: ['./invoice-regular-note.component.scss']
})
export class InvoiceRegularNoteComponent implements OnInit {
  @Input() invoiceNotes: Array<InvoiceNote> = [];
  @Output() onUpdateInvoiceData = new EventEmitter();
  validNote: boolean = true;
  selectedNote: InvoiceNote = null;
  toogleCustomerNote: boolean = false;
  changeRegularNote: boolean = false;
  constructor(private noteService: NoteService,
    private billableService: BillableService,
    private billableStateService: BillableStateService,
    private elRef: ElementRef,) { }

  ngOnInit() {
    this.selectedNote = this.billableStateService.getRegularNote();
    if (this.selectedNote) {
      this.elRef.nativeElement.querySelector("#description-regular-note").value = this.selectedNote.content;
      if (!this.selectedNote.id) this.selectedNote = null;
    }
  }
  onCheckUpdateTitleNote(data) {
    if (this.selectedNote) {
      this.validNote = true;
      this.changeRegularNote = true;
      this.selectedNote.title = data;
    }
  }
  onSetRegularNote(data) {
    this.selectedNote.title = data;
    this.changeRegularNote = true;
  }
  onCheckUpdateDescriptionNote() {
    if (this.selectedNote) this.changeRegularNote = true;
  }
  onUpdateRegularNote() {
    if (this.selectedNote.title.length == 0) {
      this.validNote = false;
      return;
    };
    this.selectedNote.content = this.elRef.nativeElement.querySelector("#description-regular-note").value;
    console.log("onUpdateRegularNote");
    this.billableService.editNote(this.selectedNote.id, this.selectedNote.getDataForAdd()).subscribe(data => {
      this.changeRegularNote = false;
      this.billableStateService.setRegulatNote(new InvoiceNote({
        id: this.selectedNote.id,
        content: this.elRef.nativeElement.querySelector("#description-regular-note").value,
        title: this.selectedNote.title
      }));
    })
  }
  onChangeDescriptionNote() {
    let request: PartialUpdate = new PartialUpdate(null, null, null, this.selectedNote.content, null, null);
    this.onUpdateInvoiceData.emit(request);
    this.billableStateService.setRegulatNote(this.selectedNote);
  }

  onChangeRegularNote() {
    if (this.selectedNote) {
      let selectedNote = JSON.parse(JSON.stringify(this.selectedNote));
      selectedNote.content = this.elRef.nativeElement.querySelector("#description-regular-note").value;
      let request: PartialUpdate = new PartialUpdate(null, null, null, selectedNote.content, null, null);
      this.onUpdateInvoiceData.emit(request);
      this.billableStateService.setRegulatNote(selectedNote);
    } else {
      let selectedNote = new InvoiceNote({
        content: this.elRef.nativeElement.querySelector("#description-regular-note").value,
      });
      let request: PartialUpdate = new PartialUpdate(null, null, null, selectedNote.content, null, null);
      this.onUpdateInvoiceData.emit(request);
      this.billableStateService.setRegulatNote(selectedNote);
    }

  }
  onSelectNotes(data) {
    this.selectedNote = data;
    this.changeRegularNote = false;
    if (this.selectedNote) {
      this.validNote = true;
      let request: PartialUpdate = new PartialUpdate(null, null, null, this.selectedNote.content, null, null);
      this.onUpdateInvoiceData.emit(request);
      this.elRef.nativeElement.querySelector("#description-regular-note").value = this.selectedNote.content;
      this.billableStateService.setRegulatNote(this.selectedNote);
    } else {
      this.elRef.nativeElement.querySelector("#description-regular-note").value = "";
      this.billableStateService.setRegulatNote(null);
    }
  }
  getInvoiceNote() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.invoiceNotes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    })
  }
}
