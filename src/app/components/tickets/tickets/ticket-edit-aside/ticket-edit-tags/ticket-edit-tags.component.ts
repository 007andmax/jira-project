import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TagsStateService } from 'src/app/components/shared/tags/services/tags-state.service';
import { MatChipInputEvent } from '@angular/material';
import { TagsService } from 'src/app/services/tags/tags.service';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';

@Component({
  selector: 'app-ticket-edit-tags',
  templateUrl: './ticket-edit-tags.component.html',
  styleUrls: ['./ticket-edit-tags.component.scss']
})
export class TicketEditTagsComponent implements OnInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  @Input() selectedTag = [];
  tags: Array<Tag> = [];
  reqTags: Array<Tag> = [];
  sub = new Subscription();
  editItem: any;
  init: boolean = false;
  isChangeInput: boolean = false;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();

  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private tagsService: TagsService,
    private tagsState: TagsStateService,
    public tagsRealTimeService: TagsRealTimeService,
    public cd: ChangeDetectorRef
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    let getTags = this.tagsService.getTags().subscribe((data) => {
      this.tags = data;
      this.reqTags = JSON.parse(JSON.stringify(data));
      this.sortTags();
    })
    this.sub.add(getTags);
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && data.data instanceof Array) data.data.forEach(element => this.updateTagByRealTimes(element));
      if (data.action === "TAG_SAVED" && data.data instanceof Object) this.updateTagByRealTimes(data.data);
      if (data.action === "TAG_REMOVED") {
        let index = this.tags.findIndex(item => item.id === data.data);
        let indexreqTags = this.reqTags.findIndex(item => item.id === data.data);
        if (index > -1) this.tags.splice(index, 1);
        if (indexreqTags > -1) this.reqTags.splice(index, 1);
      }
      this.sortTags();
      this.cd.detectChanges();
    })
    this.sub.add(changeTagsArray);
    this.onInitClearState();
    this.onCheckEditItem();
  }
  updateTagByRealTimes(data) {
    let index = this.tags.findIndex(item => item.id === data.id);
    let indexreqTags = this.reqTags.findIndex(item => item.id === data.id);
    if (index > -1) {
      this.tags[index] = data;
    } else {
      this.tags.push(data);
    }
    if (indexreqTags > -1) {
      this.reqTags[index] = data;
    } else {
      this.reqTags.push(data);
    }
  }
  sortTags() {
    this.tags = this.tags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    this.reqTags = this.reqTags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
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

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.closest('.selected-tag-ticket')) return;
    if (!event.target.closest('app-ticket-edit-tags') && !event.target.closest('.dropdown-menu') && (this.init || this.isChangeInput)) {
      if (this.isChangeInput) {
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: this.userInput.nativeElement.value.trim(), id: ''
        }
        let setTags = this.tagsService.addTicketsTags(tag).subscribe((res) => {
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          this.userInput.nativeElement.value = '';
          this.tagCtrl.setValue(null);
          this.isChangeInput = false;
          this.init = false;
          this.tagsChange.emit(this.selectedTag);
        });
        this.sub.add(setTags);
      } else {
        this.init = false;
        this.tagsChange.emit(this.selectedTag);
      }

    }
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.tagsState.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

  onKeyUp(event) {

    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;

      if ((value || '').trim()) {
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
        }

        let setTags = this.tagsService.addTicketsTags(tag).subscribe((res) => {
          this.init = true;
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          if (input) {
            input.value = '';
          }
          this.tagCtrl.setValue(null);
        });
        this.sub.add(setTags);
      }

    }

  }

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
    }
    this.init = true;
  }

  /**
   * Add tag to selected
   * @param tag - selected tag
   */
  public selected(tag): void {
    this.init = true;
    let find = this.selectedTag.find(item => item.id === tag.id);
    if (!find) {
      this.selectedTag.push(tag);
    }
    this.isChangeInput = false;
    this.tagCtrl.setValue(null);
  }

  onSearch(event) {
    this.isChangeInput = (event.target.value.length > 0) ? true : false;
    this.tags = this.reqTags.filter(item => item.word.includes(event.target.value));
  }
  onChangeDropDown(data) {
    if (!data) this.tags = JSON.parse(JSON.stringify(this.reqTags));
  }
  /**
   * Close tags list
   */
  public close() {
    this.selectedTag = [];
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
