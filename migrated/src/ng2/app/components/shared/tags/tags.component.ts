import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, ChangeDetectorRef, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagsService } from 'src/ng2/app/services/tags/tags.service';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { TagsStateService } from './services/tags-state.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  selectedTag = [];
  tags: Array<Tag> = [];
  sub = new Subscription();
  editItem:any;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  //@ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Output() tagsChange = new EventEmitter();
  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {UsersService} userService Service to work with users
   * @param {NgbActiveModal} activeModal Service to work with modal
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  public constructor(
    private tagsService: TagsService,
    private tagsState: TagsStateService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {

    this.tagsService.getTags().subscribe((data) => {
      this.tags = data;
    })
   /* this.userInput.nativeElement.onblur = (e) => {
      if (this.matAutocomplete.isOpen) {
        let modal = this.matAutocomplete.panel.nativeElement;
        modal.parentNode.style.width = 'max-content';
      }
    }*/
    this.onInitClearState();
    this.onCheckEditItem();
  }
  private onCheckEditItem () {
    let getTagsFromEdit = this.tagsState.getTagsFromEdit().subscribe((data) => {
      this.selectedTag = data;
    });
    this.sub.add(getTagsFromEdit);
  }

  private onInitClearState() {
    let getClearState = this.tagsState.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

  /**
   * Add selected user
   * @param event - selected user
   */
  public add(event: MatChipInputEvent): void {

    // if (!this.matAutocomplete.isOpen) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      let tag: Tag = {
        colorCode: 0, usedCounter: 0, word: value.trim(), id :''
      }

      this.tagsService.setTags(tag).subscribe((res) => {
        tag.id = res.id;
        this.tags.push(tag);
        this.selectedTag.push(tag);
       this.tagsChange.emit(this.selectedTag);
      });
    
    }
    if (input) {
      input.value = '';
    }
    this.tagCtrl.setValue(null);
    // }
  }

  /**
   * Remove user from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.tagsChange.emit(this.selectedTag);
    }
  }

  /**
   * Add user to selected
   * @param event - selected user
   */
  public selected(tag): void {
  console.log('tag',tag);
    this.selectedTag.push(tag);
    this.tagsChange.emit(this.selectedTag);
  //  this.userInput.nativeElement.blur();
    this.tagCtrl.setValue(null);
  }

  /**
   * Close send modal
   */
  public close() {
    this.selectedTag = [];
    this.tagsChange.emit(this.selectedTag);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
