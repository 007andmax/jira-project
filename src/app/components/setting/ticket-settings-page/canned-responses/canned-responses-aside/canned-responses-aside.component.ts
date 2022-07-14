import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NoteService } from 'src/app/services/note/note.service';
import { NoteStateService } from 'src/app/states/note/note-state.service';
import { NoteTemplate } from '../class/note-template';
import { NoteTemplateValidate } from '../class/note-template-validate';

@Component({
  selector: 'canned-responses-aside',
  templateUrl: './canned-responses-aside.component.html',
  styleUrls: ['./canned-responses-aside.component.scss']
})
export class CannedResponsesAsideComponent implements OnInit {

  noteTemplate: NoteTemplate = new NoteTemplate();
  noteTemplateValidate: NoteTemplateValidate = new NoteTemplateValidate();
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
    placeholder: 'Write your draft for companies',
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
    sanitize: true,

  };
  opened: boolean = false;
  constructor(private noteStateService: NoteStateService,
    private noteService: NoteService) { }

  ngOnInit() {
    this.noteStateService.onOpenAddAside.subscribe(data => {
      this.opened = true;
    })
    this.noteStateService.onEditNote.subscribe(data => {
      this.noteTemplate = new NoteTemplate(data);
      this.noteTemplate.setEditMode(true);
      this.opened = true;

    })
    this.noteStateService.onCopyNote.subscribe(data => {
      this.noteTemplate = new NoteTemplate(data);
      this.opened = true;
    })
  }
  closed() {
    this.opened = false;
    this.noteTemplate = new NoteTemplate();
    this.noteTemplateValidate = new NoteTemplateValidate();
  }
  save() {
    if (!this.noteTemplateValidate.isValidate(this.noteTemplate)) return;
    this.noteService.editNoteTemplate(this.noteTemplate.id, this.noteTemplate.getDataForRequest()).subscribe(data => {
      this.closed();
    })
  }
  add() {
    if (!this.noteTemplateValidate.isValidate(this.noteTemplate)) return;
    this.noteService.addNoteTemplate(this.noteTemplate.getDataForRequest()).subscribe(data => {
      this.closed();
    })
  }

}
