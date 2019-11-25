import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { CompanyTagsService } from './services/company-tags.service';
import { CompanyTagsStateService } from './states/company-tags-state.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { MatChipInputEvent } from '@angular/material';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';

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
    private tagsService: CompanyTagsService,
    private tagsState: CompanyTagsStateService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.tagsService.getTags().subscribe((data) => {
      this.tags = data;
      this.reqTags = data;
    })
    this.onInitClearState();
    this.onCheckEditItem();
  }


  onSearch(event) {
    console.log('eve', event.target.value);
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
    console.log('event',event.keyCode);
    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;
  
      if ((value || '').trim()) {
        let tag: Tag = {
          colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
        }
  
        this.tagsService.setTags(tag.word).subscribe((res) => {
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
  
      }
     
    }

  }

  /**
   * Add selected tag
   * @param event - selected tag
   */
  public add(event: MatChipInputEvent): void {
    if (this.blockCreateTag) return;
    // if (!this.matAutocomplete.isOpen) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      let tag: Tag = {
        colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
      }

      this.tagsService.setTags(tag.word).subscribe((res) => {
        tag.id = res.id;
        this.reqTags.push(tag);
        this.tags = this.reqTags;
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
