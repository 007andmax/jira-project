import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { NoteService } from 'src/app/services/note/note.service';
import { NoteStateService } from 'src/app/states/note/note-state.service';

@Component({
  selector: 'ticket-profile-form-update-note-list',
  templateUrl: './ticket-profile-form-update-note-list.component.html',
  styleUrls: ['./ticket-profile-form-update-note-list.component.scss']
})
export class TicketProfileFormUpdateNoteListComponent implements OnInit {
  noteTemplate: Array<NoteTemplate> = [];
  @Output() onSelected = new EventEmitter();
  constructor(private noteStateService: NoteStateService,
    private noteService: NoteService,) { }

  ngOnInit() {
    if (!this.noteStateService.isGetActiveNoteTemplates) {
      this.noteService.getActiveNotesTemplates().subscribe((data: any) => {
        this.noteTemplate = data.map(item => new NoteTemplate(item));
        this.noteStateService.setActiveNoteTemplate(this.noteTemplate);
        this.noteStateService.setIsGetActiveNoteTemplates(true);
      })
    } else {
      this.noteTemplate = this.noteStateService.getActiveNoteTemplate();
    }
  }
  onSelect(item) {
    this.noteService.getNoteTemplate(item.id).subscribe((data: any) => {
      this.onSelected.emit(data.note);
    })

  }

}
