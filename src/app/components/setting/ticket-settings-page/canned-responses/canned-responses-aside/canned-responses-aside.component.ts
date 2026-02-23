import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NoteService } from 'src/app/services/note/note.service';
import { NoteStateService } from 'src/app/states/note/note-state.service';
import { NoteTemplate } from '../class/note-template';
import { NoteTemplateValidate } from '../class/note-template-validate';
import { Subscription } from 'rxjs';

@Component({
  selector: 'canned-responses-aside',
  templateUrl: './canned-responses-aside.component.html',
  styleUrls: ['./canned-responses-aside.component.scss']
})
export class CannedResponsesAsideComponent implements OnInit, OnDestroy {

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
    sanitize: false,

  };
  opened: boolean = false;
  showKeywords: boolean = false;
  keywords = [];
  @ViewChild('editorWrap', { static: false }) editorWrap!: ElementRef<HTMLElement>;
  sub: Subscription = new Subscription();
  constructor(private noteStateService: NoteStateService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private noteService: NoteService) { }


  ngOnInit() {
    let onOpenAddAside = this.noteStateService.onOpenAddAside.subscribe(data => {
      this.opened = true;
      this.cd.detectChanges();
    })
    this.sub.add(onOpenAddAside);
    let onEditNote = this.noteStateService.onEditNote.subscribe(data => {
      this.noteTemplate = new NoteTemplate(data);
      this.noteTemplate.setEditMode(true);
      this.opened = true;
      this.cd.detectChanges();

    })
    this.sub.add(onEditNote);
    let onCopyNote = this.noteStateService.onCopyNote.subscribe(data => {
      this.noteTemplate = new NoteTemplate(data);
      this.noteTemplateValidate.setTitleIsExist(true);
      this.opened = true;
      this.cd.detectChanges();
    })
    this.sub.add(onCopyNote);
    this.noteService.getKeywords().subscribe((data: any) => {
      this.keywords = data;
    });
  }
  restoreFocus(
  ) {
    let el = this.elRef.nativeElement.querySelector(".angular-editor-textarea");
    // restore focus
    (el as HTMLElement).focus({ preventScroll: true });
  }
  insertAtCaret(text) {
    var el = document.activeElement;
    const wrap = this.editorWrap.nativeElement;
    const editable = wrap.querySelector('.angular-editor-textarea') as HTMLElement | null;
    if (!editable) return;

    // 1) insert at caret
    this.insertTextIntoAngularEditor(editable, text);

    // 2) make angular-editor notice changes
    editable.dispatchEvent(new InputEvent('input', { bubbles: true }));
    editable.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    // 3) ensure reactive form definitely gets updated
    const htmlNow = editable.innerHTML;
    this.noteTemplate.note = JSON.parse(JSON.stringify(this.noteTemplate.note));
    /* const ctrl = this.templeteForm.get('body'); 
     ctrl?.setValue(htmlNow, { emitEvent: true });
     ctrl?.markAsDirty();
     ctrl?.updateValueAndValidity();*/

  }
  insertTextIntoAngularEditor(editorHost: HTMLElement, text: string) {
    // editorHost should be the contenteditable element (.angular-editor-textarea)
    editorHost.focus();

    const sel = window.getSelection();
    if (!sel) return;

    // If selection is outside editor, move caret to end
    if (sel.rangeCount === 0 || !editorHost.contains(sel.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(editorHost);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }

    const range = sel.getRangeAt(0);

    // Replace current selection (if any) with text, leaving caret after inserted text
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);

    // Move caret to after inserted text node
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  toggle() {
    this.showKeywords = !this.showKeywords;
  }
  checkTitle() {
    this.noteTemplateValidate.resetTitle();
    if (this.noteStateService.getListNoteTemplate().find(item => item.title == this.noteTemplate.title)) {
      this.noteTemplateValidate.setTitleIsExist(true);
    } else {
      this.noteTemplateValidate.setTitleIsExist(false);
    }
  }
  closed() {
    this.opened = false;
    this.noteTemplate = new NoteTemplate();
    this.noteTemplateValidate = new NoteTemplateValidate();
    this.cd.detectChanges();
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
