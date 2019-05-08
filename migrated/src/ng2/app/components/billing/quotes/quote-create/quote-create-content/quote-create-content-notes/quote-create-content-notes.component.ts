import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";

import { QuoteService } from "../../../../../../services/quote/quote.service";
import { NoteService } from "../../../../../../services/note/note.service";

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
  public isEditMode = false;
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
   */
  constructor(
    private quoteService: QuoteService,
    private noteService: NoteService
  ) { }

  /**
   * Initializes quote create content content. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getNotes()
  }

  /**
   * Get tech company notes, and filter by type
   */
  getNotes() {
    this.quoteService.getQuoteNote().subscribe((res:any) => {
      this.noteRegularList = res.filter((item) => item['noteType'] === 'REGULAR');
      this.noteGlobal = res.find((item) => item['noteType'] === 'GLOBAL');
      this.selectedGlobalNoteItem.next(this.noteGlobal);
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
    if (this.isEditMode) {
      this.noteService.updateNote(data, this.selectedNote.id).subscribe()
    } else {
      this.noteService.createNote(data).subscribe();
    }
  }

  /**
   * create note data for createNewNote
   */
  public getNoteData() {
    return ({
      line1: this.selectedNote['line1'],
      line2: '',
      noteType: 'REGULAR',
      title: this.selectedNoteNew
    })
  }


  public showCreateNew() {
    this.isShowCreateNew = true;
  }




}
