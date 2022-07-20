import { EventEmitter, Injectable } from '@angular/core';
import { NoteTemplate } from 'src/app/components/setting/ticket-settings-page/canned-responses/class/note-template';
import { NoteRealTimeService } from './note-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class NoteStateService {
  isGetActiveNoteTemplates: boolean = false;
  noteTemplate: Array<NoteTemplate> = [];
  activeNoteTemplate: Array<NoteTemplate> = [];
  noteTemplateForRemove: NoteTemplate = null;
  onUpdateActiveNotes: EventEmitter<any> = new EventEmitter();
  onOpenAddAside: EventEmitter<any> = new EventEmitter();
  onEditNote: EventEmitter<any> = new EventEmitter();
  onCopyNote: EventEmitter<any> = new EventEmitter();
  constructor(private noteRealTimeService: NoteRealTimeService,) { }

  public onInit() {
    let changeNoteArray = this.noteRealTimeService.changeNoteArray.subscribe(data => {
      if (data.action === "CREATE_TICKET_NOTE_TEMPLATE" && data.data.active) {
        this.activeNoteTemplate.push(new NoteTemplate(data.data));
      }
      if (data.action === "EDIT_TICKET_NOTE_TEMPLATE") {
        let index = this.activeNoteTemplate.findIndex(item => item.id === data.data.id);
        if (index > -1 && data.data.active) this.activeNoteTemplate[index] = new NoteTemplate(data.data);
        if (index === -1 && data.data.active) this.activeNoteTemplate.push(new NoteTemplate(data.data));
        if (index > -1 && !data.data.active) this.activeNoteTemplate.splice(index, 1);
      }
      if (data.action === "DELETE_TICKET_NOTE_TEMPLATE") {
        let index = this.activeNoteTemplate.findIndex(item => item.id === data.data);
        if (index > -1) this.activeNoteTemplate.splice(index, 1);
      }
      this.activeNoteTemplate.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.onUpdateActiveNotes.emit(this.activeNoteTemplate);
    })
  }
  public getActiveNoteTemplate() {
    return this.activeNoteTemplate;
  }
  public setActiveNoteTemplate(data) {
    this.activeNoteTemplate = data;
  }
  public setIsGetActiveNoteTemplates(data) {
    this.isGetActiveNoteTemplates = data;
  }
  public getListNoteTemplate() {
    return this.noteTemplate;
  }
  public setNoteTemplate(data) {
    this.noteTemplate = data;
  }
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
