import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { NoteService } from 'src/app/services/note/note.service';
import { NoteRealTimeService } from 'src/app/states/note/note-real-time.service';
import { NoteStateService } from 'src/app/states/note/note-state.service';

@Component({
  selector: 'ticket-profile-form-update-note-list',
  templateUrl: './ticket-profile-form-update-note-list.component.html',
  styleUrls: ['./ticket-profile-form-update-note-list.component.scss']
})
export class TicketProfileFormUpdateNoteListComponent implements OnInit {
  noteTemplate: Array<NoteTemplate> = [];
  @Output() onSelected = new EventEmitter();
  sub: Subscription = new Subscription();
  constructor(private noteStateService: NoteStateService,
    public cd: ChangeDetectorRef,
    private noteService: NoteService,) { }

  ngOnInit() {
    let onUpdateActiveNotes = this.noteStateService.onUpdateActiveNotes.subscribe(data => {
      this.noteTemplate = this.noteStateService.getActiveNoteTemplate();
    })
    this.sub.add(onUpdateActiveNotes);
  }
  onGetNoteList() {
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
