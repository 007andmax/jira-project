import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { CompanyTagsStateService } from './states/company-tags-state.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { MatChipInputEvent } from '@angular/material';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { TagsService } from 'src/ng2/app/services/tags/tags.service';

@Component({
  selector: 'app-company-tags',
  templateUrl: './company-tags.component.html',
  styleUrls: ['./company-tags.component.scss']
})
export class CompanyTagsComponent implements OnInit, OnDestroy {

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
  reqTags: Array<Tag> = [];
  sub = new Subscription();
  editItem: any;
  @Input() blockCreateTag: boolean = false;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();

  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private tagsService: TagsService,
    private tagsState: CompanyTagsStateService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
   let getTags =  this.tagsService.geCompanytTags().subscribe((data) => {
      this.tags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.reqTags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
      1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    })
    this.sub.add(getTags);
    this.onInitClearState();
    this.onCheckEditItem();
  }


  onSearch(event) {

    this.tags = this.reqTags.filter(item => item.word.includes(event.target.value));
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

  onKeyUp (event) {

    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;

      if ((value || '').trim()) {
        let tag: Tag = {
          colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
        }

        let setTags =  this.tagsService.setCompanyTags(tag.word).subscribe((res) => {
          tag.id = res.id;
          this.reqTags.push(tag);
          this.tags = this.reqTags;
          this.selectedTag.push(tag);
          this.tagsChange.emit(this.selectedTag);
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
    this.userInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.tags = this.reqTags;
  }

  /**
   * Close tags list
   */
  public close() {
    this.selectedTag = [];
    this.tags = this.reqTags;
    this.tagsChange.emit(this.selectedTag);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
