import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { NoteService } from 'src/app/services/note/note.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
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
  @Input() placement: string = "top-right";
  constructor(private noteStateService: NoteStateService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private noteService: NoteService,) { }

  ngOnInit() {
    let onUpdateActiveNotes = this.noteStateService.onUpdateActiveNotes.subscribe(data => {
      this.noteTemplate = this.noteStateService.getActiveNoteTemplate();
      console.log("this.noteTemplate", this.noteTemplate);
      this.cd.detectChanges();
    })
    this.sub.add(onUpdateActiveNotes);
  }
  onGetNoteList() {
    if (!this.noteStateService.isGetActiveNoteTemplates) {
      this.noteService.getActiveNotesTemplates().subscribe((data: any) => {
        this.noteTemplate = data.map(item => new NoteTemplate(item));
        this.noteTemplate.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
          1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
        // this.noteStateService.setActiveNoteTemplate(this.noteTemplate);
        // this.noteStateService.setIsGetActiveNoteTemplates(true);
        console.log("this.noteTemplate", this.noteTemplate);
        this.cd.detectChanges();
      })
    } else {
      this.noteTemplate = this.noteStateService.getActiveNoteTemplate();
      console.log("this.noteTemplate", this.noteTemplate);
    }
  }
  onSelect(item) {
    this.noteService.getNoteTemplate(item.id).subscribe((data: any) => {
      this.onSelected.emit(data.note);
    })

  }
  createResponse() {
    this.noteStateService.openAddAside();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
