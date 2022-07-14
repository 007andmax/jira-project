import { EventEmitter, Injectable } from '@angular/core';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { NoteRealTimeService } from './note-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class NoteStateService {
  noteTemplateForRemove: NoteTemplate = null;
  onOpenAddAside: EventEmitter<any> = new EventEmitter();
  onEditNote: EventEmitter<any> = new EventEmitter();
  onCopyNote: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public setNoteTemplateForRemove(data) {
    this.noteTemplateForRemove = data;
  }
  public getNoteTemplateForRemove() {
    return this.noteTemplateForRemove;
  }
  public openAddAside() {
    this.onOpenAddAside.emit(null);
  }
  public copyNote(data) {
    this.onCopyNote.emit(data);
  }
  public editNote(data) {
    this.onEditNote.emit(data);
  }
}
