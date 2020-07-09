import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MatChipInputEvent } from '@angular/material';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { TagsService } from 'src/ng2/app/services/tags/tags.service';

@Component({
  selector: 'app-left-panel-tags',
  templateUrl: './left-panel-tags-companies.component.html',
  styleUrls: ['./left-panel-tags-companies.component.scss']
})
export class LeftPanelTagsComponent implements OnInit, OnDestroy {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  focus = false;
  isResend = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  selectedTag = [];
  reqTags: Array<Tag> = [];
  tags: Array<Tag> = [];
  sub = new Subscription();
  editItem: any;
  @Input() type: string = "COMPANY";
  @Input() blockCreateTag: boolean = false;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();

  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private tagsService: TagsService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    if (this.type === "COMPANY") {
     let geCompanytTags =  this.tagsService.geCompanytTags().subscribe((data) => {
        this.tags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
          1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
        this.reqTags = data;
      })
      this.sub.add(geCompanytTags);
    } else {
    let getTags =   this.tagsService.getTags().subscribe((data) => {
        this.tags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
          1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
        this.reqTags = data;
      })
      this.sub.add(getTags);
    }



  }

  onSearch(event) {

    this.tags = this.reqTags.filter(item => item.word.includes(event.target.value));
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
      if (this.type === "COMPANY") {
        this.tagsService.setCompanyTags(tag.word).subscribe((res) => {
          tag.id = res.id;

          this.reqTags.push(tag);
          this.tags = this.reqTags;
          this.selectedTag.push(tag);
          this.tagsChange.emit(this.selectedTag);
        });
      }


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
