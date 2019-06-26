import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";

import { QuoteService } from "../../../../../../services/quote/quote.service";
import { NoteService } from "../../../../../../services/note/note.service";
import {QuoteStateService} from "../../quote-state.service";

/**
 *  Quotes create content notes component
 */
@Component({
  selector: 'app-quote-create-content-notes',
  templateUrl: './quote-create-content-notes.component.html',
  styleUrls: ['./quote-create-content-notes.component.scss']
})
export class QuoteCreateContentNotesComponent implements OnInit {

  public noteRegularList = [];
  public noteGlobal: any;
  public selectedNote: any;
  public selectedNoteNew: string;
  public selectedNoteText: string;
  public editNoteNew: string;
  public isShowEditNote = false;
  public isEditMode = false;
  public editMode = false;
  public isShowCreateNew = false;
  @ViewChild('instance') instance: NgbTypeahead;
  @Output() selectedRegularNoteItem = new EventEmitter<any>();
  @Output() selectedGlobalNoteItem = new EventEmitter<any>();
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {NoteService} noteService Service to work with api
   * @param {QuoteService} quoteService Service to work with api
   * @param {QuoteStateService} quoteStateService Service to work quote state
   */
  constructor(
    private quoteService: QuoteService,
    private noteService: NoteService,
    private quoteStateService: QuoteStateService
  ) { }

  /**
   * Initializes quote create content content. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getNotes();
    this.getState();
  }

  /**
   * Get tech company notes, and filter by type
   */
  getNotes() {
    this.quoteService.getQuoteNote().subscribe((res:any) => {
      this.noteRegularList = res.filter((item) => item['noteType'] === 'REGULAR');
      this.noteGlobal = res.find((item) => item['noteType'] === 'GLOBAL');
      if (this.editMode) {
        this.noteGlobal = this.quoteStateService.getGlobalNote();
      }
      this.setGlobalNote(this.noteGlobal);
    })
  }

  /**
   * show and find text in dropdown
   */
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term =>  this.noteRegularList));
  };

  /**
   * select note and emit regular note to parent
   * @param note selected note
   */
  public selectItem(note) {
    this.isEditMode = true;
    this.selectedNote = note.item;
    this.selectedRegularNoteItem.next(this.selectedNote);
    this.quoteStateService.setSelectedNote(note.item.line1);
    this.quoteStateService.setSelectedNoteFull(note.item);
  }

  /**
   * format select output
   */
  formatter = (result: string) => {
    return result['title'];
  };

  /**
   * create new note
   */
  public createNewNote() {
    const data = this.getNoteData();
    console.log(this.isEditMode, 'this.isEditMode');
    if (this.isEditMode) {
      this.noteService.updateNote({
        line1: this.selectedNoteText,
        line2: '',
        noteType: 'REGULAR',
        title: this.getTitle(this.selectedNoteNew)
      }, this.selectedNote.id).subscribe()
    } else {
      this.noteService.createNote({
        line1: this.selectedNoteNew,
        line2: '',
        noteType: 'REGULAR',
        title: this.selectedNoteNew
      }).subscribe();
    }
  }

  public onEditNote () {
    
  }

  private getTitle(value) {
    return value.title ? value.title : value;
  }

  /**
   * create note data for createNewNote
   */
  public getNoteData() {
    return ({
      line1: this.selectedNoteText || (this.selectedNote && this.selectedNote['line1']),
      line2: '',
      noteType: 'REGULAR',
      title: this.selectedNoteNew
    })
  }

  /**
   * set global note
   */
  public setGlobalNote(value,update = false) {
    console.log('setGlobalNote');
    this.isShowEditNote = update;
    this.editNoteNew = value;
    this.selectedGlobalNoteItem.next(value);
    this.quoteStateService.setGlobalNote(value);
  }

  /**
   * Show create new notes fields
   */
  public showCreateNew(value) {
    this.selectedNote['line1'] = value;
    this.selectedNoteText = value;
    this.isShowCreateNew = true;
    this.quoteStateService.setSelectedNote(value);
  }
  

  /**
   * get mode state
   */
  public getState() {
    this.editMode = this.quoteStateService.getState().params.editMode;
    if (this.editMode) {
      this.isEditMode = true;
      this.selectedNoteNew = this.quoteStateService.getSelectedNote();
      this.selectedNote = this.quoteStateService.getSelectedNote();
    }
  }

}
