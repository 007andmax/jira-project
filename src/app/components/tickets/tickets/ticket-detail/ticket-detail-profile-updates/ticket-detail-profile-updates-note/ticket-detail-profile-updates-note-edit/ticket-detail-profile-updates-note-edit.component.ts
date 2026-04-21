import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../../../ticket-edit-aside/services/ticket-state.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'ticket-detail-profile-updates-note-edit',
  templateUrl: './ticket-detail-profile-updates-note-edit.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note-edit.component.scss']
})
export class TicketDetailProfileUpdatesNoteEditComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  @Input() idTicket: string;
  editUpdate: TicketProfileUpdate;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '100%',
    minHeight: '5rem',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write ticket conversation here…',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarPosition: 'bottom',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
  };
  constructor(private elRef: ElementRef,
    private ticketStateService: TicketStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.editUpdate = new TicketProfileUpdate(this.update);
    //   this.elRef.nativeElement.querySelector('#note-description').innerHTML = this.update.note;
  }
  public onChangeDescription(event) {
    this.editUpdate.note = event.target.value.replace(/\n/g, '<br/>');

  }
  public onPastDescription(value) {
    this.editUpdate.note = value.replace(/\n/g, '<br/>');
  }
  saveService() {
    this.ticketsService.updateNote(this.idTicket, this.update.id, this.editUpdate.note).subscribe(res => {
      this.ticketStateService.setEditUpdate(res);
      this.onEdit.emit(null);
    })
  }
  cancelService() {
    this.onEdit.emit(null);
  }
}