import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagsService } from 'src/app/services/tags/tags.service';
import { Tag } from 'src/app/interfaces/tag/tag';
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
  editItem: any;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();

  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private tagsService: TagsService,
    private tagsState: TagsStateService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    let getTags = this.tagsService.getTags().subscribe((data) => {
      this.tags = data;
    })
    this.sub.add(getTags);
    this.onInitClearState();
    this.onCheckEditItem();
  }

  /**
  * Subscribe for edit mode
  */
  private onCheckEditItem() {
    let getTagsFromEdit = this.tagsState.getTagsFromEdit().subscribe((data) => {
      this.selectedTag = data;
    });
    this.sub.add(getTagsFromEdit);
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.tagsState.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

  /**
   * Add selected tag
   * @param event - selected tag
   */
  public add(event: MatChipInputEvent): void {

    // if (!this.matAutocomplete.isOpen) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      let tag: Tag = {
        colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
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
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.tagsChange.emit(this.selectedTag);
    }
  }

  /**
   * Add tag to selected
   * @param tag - selected tag
   */
  public selected(tag): void {
    this.selectedTag.push(tag);
    this.tagsChange.emit(this.selectedTag);
    //  this.userInput.nativeElement.blur();
    this.tagCtrl.setValue(null);
  }

  /**
   * Close tags list
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
