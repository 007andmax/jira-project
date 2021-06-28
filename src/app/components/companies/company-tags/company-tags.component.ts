import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { CompanyTagsStateService } from './states/company-tags-state.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';

@Component({
  selector: 'app-company-tags',
  templateUrl: './company-tags.component.html',
  styleUrls: ['./company-tags.component.scss']
})
export class CompanyTagsComponent implements OnInit, OnDestroy {

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  selectedTag = [];
  tags: Array<Tag> = [];
  reqTags: Array<Tag> = [];
  sub = new Subscription();
  @Input() editItems: Array<string>;
  @Input() placement: string;
  @Input() blockCreateTag: boolean = false;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    public tagsService: TagsService,
    private tagsState: CompanyTagsStateService,
    private tagsStateService: TagsStateService,
    private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.tags = this.tagsStateService.getTags();
    this.reqTags = JSON.parse(JSON.stringify(this.tagsStateService.getTags()));
    let getTags = this.tagsStateService.onGetTags.subscribe((data: Array<Tag>) => {

      this.tags = data;
      this.reqTags = JSON.parse(JSON.stringify(data));
      this.onCheckEditItem();
    })
    this.sub.add(getTags);
    this.onInitClearState();
    this.onCheckEditItem();
  }
  getCompanyName(tag) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === tag.companyId);
    return (company) ? company.name : '';
  }
  onSearch(event) {
    this.tags = this.reqTags.filter(item => item.word.includes(event.target.value));
  }

  /**
  * Subscribe for edit mode
  */
  onCheckEditItem() {
    if (this.editItems) this.editItems.forEach(item => {
      this.selectedTag.push(this.tags.find(tag => tag.id === item));
    })
    let getTagsFromEdit = this.tagsState.getTagsFromEdit().subscribe((data) => {
      this.selectedTag = data;
    });
    this.sub.add(getTagsFromEdit);
  }
  public clearWithOutChanges() {

    this.selectedTag = [];
  }
  /**
  * Subscribe for clear data
  */
  onInitClearState() {
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
        let setTags = this.tagsService.addCompanyTags(tag).subscribe((res) => {
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
      this.cd.detectChanges();
    }
  }
  isSeleted(item) {
    return this.selectedTag.find(element => element.id === item.id);
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedTag.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedTag.splice(findIndex, 1);
    } else {
      this.selectedTag.push(newItem);
      this.tags = this.reqTags;
    }
    this.tagsChange.emit(this.selectedTag);
    this.tagCtrl.setValue(null);
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
