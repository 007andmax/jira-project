import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";

import { QuoteService } from "../../../../../../services/quote/quote.service";
import { NoteService } from "../../../../../../services/note/note.service";

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
  @ViewChild('instance') instance: NgbTypeahead;
  @Output() selectedRegularNoteItem = new EventEmitter<any>();
  @Output() selectedGlobalNoteItem = new EventEmitter<any>();
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private quoteService: QuoteService,
    private noteService: NoteService
  ) { }

  ngOnInit() {
    this.getNotes()
  }

  getNotes() {
    this.quoteService.getQuoteNote().subscribe((res) => {
      this.noteRegularList = [...res].filter((item) => item['noteType'] === 'REGULAR');
      this.noteGlobal = [...res].find((item) => item['noteType'] === 'GLOBAL');
      this.selectedGlobalNoteItem.next(this.noteGlobal);
    })
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term =>  this.noteRegularList));
  };

  public selectItem(note) {
    this.selectedNote = note.item;
    this.selectedRegularNoteItem.next(this.selectedNote);
  }

  formatter = (result: string) => {
    return result['title'];
  };

  public createNewNote() {
    const data = this.getNoteData();
    this.noteService.createNote(data).subscribe();
  }

  public getNoteData() {
    return ({
      line1: this.selectedNote['line1'],
      line2: '',
      noteType: 'REGULAR',
      title: this.selectedNoteNew
    })
  }




}
