import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { CompanyTagsStateService } from './../../companies/company-tags/states/company-tags-state.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';

@Component({
  selector: 'app-company-dash-tags',
  templateUrl: './company-dash-tags.component.html',
  styleUrls: ['./company-dash-tags.component.scss']
})
export class CompanyDashTagsComponent implements OnInit, OnDestroy {

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
  @Input() tagList = [];
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() tagsChange = new EventEmitter();

  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private tagsService: TagsService,
    private tagsState: CompanyTagsStateService,
    private companiesStateService: CompaniesStateService,
    private tagsStateService: TagsStateService,
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
    })
    this.sub.add(getTags);
    this.onInitClearState();
    this.selectedTag = this.tagList;
  }

  getCompanyName(tag) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === tag.companyId);
    return (company) ? company.name : '';
  }
  onSearch(event) {

    this.tags = this.reqTags.filter(item => item.word.includes(event.target.value));
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
