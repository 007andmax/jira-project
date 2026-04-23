
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CompanyTagsStateService } from './states/company-tags-state.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { CompanyTagsListService } from './services/company-tags-list.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { CompanyTag } from './class/company-tag';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { MatFormFieldComponent } from '../../shared/mat-form-field/mat-form-field.component';
import { MatChipListComponent } from '../../shared/mat-chip-list/mat-chip-list.component';

@Component({
  standalone: true,
  imports: [MatChipListComponent, CommonModule],
  selector: 'app-company-tags',
  templateUrl: './company-tags.component.html',
  styleUrls: ['./company-tags.component.scss'],
  providers: [CompanyTagsListService, TicketsListService],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CompanyTagsComponent implements OnInit, OnDestroy {
  page: number = 0;
  public infiniteScrollDisabled = true;
  showPreloader: boolean = true;
  searchName: string = "";
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() selectedTag: Array<CompanyTag> = [];
  tags: Array<CompanyTag> = [];
  reqTags: Array<CompanyTag> = [];
  sub = new Subscription();
  @Input() companyId: string;
  @Input() editItems: Array<string>;
  @Input() placement: string;
  @Input() placeholder: string = 'Search By Tags';
  @Input() showLabel: boolean = true;
  @Input() filter: boolean = false;
  @Input() blockCreateTag: boolean = false;
  @Input() blockUserTag: boolean = false;
  @Input() isRemoveCompanySelectedTag: boolean = true;
  @Input() isDisabled: boolean = false;
  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('dp', { static: true }) dp: any;
  @Output() tagsChange = new EventEmitter();
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    public tagsService: TagsService,
    private tagsState: CompanyTagsStateService,
    public tagsStateService: TagsStateService,
    private companiesStateService: CompaniesStateService,
    public companyTagsListService: CompanyTagsListService,
    public tagsRealTimeService: TagsRealTimeService,
    public elRef: ElementRef,
    public cd: ChangeDetectorRef,
    public deviceTagsService: DeviceTagsService,
    public ticketsListService: TicketsListService,
    public deviceTagsStateService: DeviceTagsStateService,
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.onInitClearState();
    this.onCheckEditItem();
  }
  getCompanyName(tag) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === tag.companyId);
    return (company) ? company.name : '';
  }
  onSearch(event) {
    this.searchName = event.target.value;
    this.setDefaultScoll();
    this.onScroll(JSON.parse(JSON.stringify(this.searchName)));
  }

  /**
  * Subscribe for edit mode
  */
  onCheckEditItem() {
    if (this.editItems) this.editItems.forEach(item => {
      let find = this.tags.find(tag => tag.id === item);
      if (find) this.selectedTag.push(find);
    })
    if (this.tagsState) {
      let getTagsFromEdit = this.tagsState.getTagsFromEdit().subscribe((data) => {
        this.selectedTag = data;
        this.cd.markForCheck();
      });
      this.sub.add(getTagsFromEdit);
    }
    if (this.cd) this.cd.markForCheck();
  }
  public setEditItems(data) {
    this.editItems = data;
    this.editItems.forEach(item => {
      let find = this.tags.find(tag => tag.id === item);
      if (find) this.selectedTag.push(find);
    })
    this.cd.markForCheck();
  }
  public clearWithOutChanges() {
    this.userInput.nativeElement.value = '';
    this.searchName = "";
    this.selectedTag = [];
    this.tags = this.reqTags;
    this.userInput.nativeElement.blur();
    if (this.dp) this.dp.close();
    this.cd.detectChanges();
  }
  public checkRemoveTag(index) {
    if (this.selectedTag[index].defaultTag === 'USER_TAG' && this.blockUserTag) return false;
    if (this.companyId && this.selectedTag[index].companyId == this.companyId && !this.isRemoveCompanySelectedTag) return false;
    return true;
  }

  /**
  * Subscribe for clear data
  */
  onInitClearState() {
    if (this.tagsState) {
      let getClearState = this.tagsState.getClearState().subscribe(() => this.close());
      this.sub.add(getClearState);
    }
  }
  public setDefaultScoll() {
    this.page = 0;
    this.companyTagsListService.setBlockList(false);
    this.tags = [];
    this.reqTags = [];
    this.cd.markForCheck();
  }
  public onScroll(searchName = null) {

    this.infiniteScrollDisabled = true;
    this.getTags(searchName);
  }
  getTags(searchName = null) {
    if (this.companyTagsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.tagsService.search(this.page, this.searchName, this.filter).subscribe((data: any) => {
      if (searchName && this.tags.length > 0) {
        this.tags = [];
        this.reqTags = [];
        this.page = 0;
      }
      this.tags = [...this.tags, ...data.commonTagViews.map(item => new CompanyTag(item))];
      this.reqTags = [...this.reqTags, ...JSON.parse(JSON.stringify(data.commonTagViews))];
      this.page++;
      this.infiniteScrollDisabled = false;
      if (this.reqTags.length === data.totalElements) {
        this.companyTagsListService.setBlockList(true);
      } else {
        this.companyTagsListService.setBlockList(false);
      }
      this.showPreloader = false;
      this.cd.markForCheck();
    })
  }
  openChange(open) {
    if (open) {
      this.showPreloader = true;
      this.setDefaultScoll();
      this.onScroll();
    }
  }
  onKeyUp(event) {
    if (event.keyCode === 40) {
      let indexSelected = this.tags.findIndex(item => item.isHover);
      if (indexSelected > -1) this.tags[indexSelected].isHover = false;
      indexSelected++;
      if (indexSelected === this.tags.length) indexSelected = 0;
      this.tags[indexSelected].isHover = true;
      let isScrolledIntoView = this.isScrolledIntoView(this.elRef.nativeElement.querySelector(`#tag-${this.tags[indexSelected].id}`));
      if (!isScrolledIntoView) this.elRef.nativeElement.querySelector('.content').scrollTop = ((indexSelected < 8) ? 0 : indexSelected * 32);
      this.cd.markForCheck();
      return;
    }
    if (event.keyCode === 38) {
      let indexSelected = this.tags.findIndex(item => item.isHover);
      if (indexSelected > -1) this.tags[indexSelected].isHover = false;
      if (indexSelected === 0 || indexSelected === -1) {
        indexSelected = this.tags.length - 1;
      } else {
        indexSelected--;
      }
      this.tags[indexSelected].isHover = true;
      let isScrolledIntoView = this.isScrolledIntoView(this.elRef.nativeElement.querySelector(`#tag-${this.tags[indexSelected].id}`));
      if (!isScrolledIntoView) this.elRef.nativeElement.querySelector('.content').scrollTop = ((indexSelected < 8) ? 0 : indexSelected * 32);
      this.cd.markForCheck();
      return;
    }
    if (event.keyCode === 13) {
      let indexSelected = this.tags.findIndex(item => item.isHover);
      if (indexSelected > -1) {
        let findTag = this.selectedTag.find(item => item.id === this.tags[indexSelected].id);
        if (!findTag) {
          this.searchName = "";
          this.selectedTag.push(this.tags[indexSelected]);
          this.tagsChange.emit(this.selectedTag);
          this.cd.detectChanges();
        }
        return;
      }

      const input = event.target.input;
      const value = event.target.value;
      if ((value || '').trim()) {
        let search = this.tags.find(item => item.word == value);
        if (search) {
          this.selectedTag.push(search);
          this.tagsChange.emit(this.selectedTag);
          if (input) {
            input.value = '';
          }
          this.userInput.nativeElement.value = '';
          this.searchName = "";
          this.dp.close();
          this.cd.detectChanges();
          return;
        }
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
          this.userInput.nativeElement.value = '';
          this.searchName = "";
          this.cd.detectChanges();
        });
        this.sub.add(setTags);
      }
    }
  }

  isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    var isVisible = (elemTop >= 0) && (elemBottom <= this.elRef.nativeElement.querySelector(".content").innerHeight);
    return isVisible;
  }

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      if (!this.checkRemoveTag(index)) return;
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
    this.userInput.nativeElement.value = '';

    if (this.searchName.length > 0) {
      this.searchName = "";
      this.setDefaultScoll();
      this.onScroll();
    }
  }

  public setSelectedTag(data) {
    this.selectedTag = data;
    this.cd.markForCheck();
  }

  /**
   * Close tags list
   */
  public close() {
    this.selectedTag = [];
    this.tags = this.reqTags;
    this.tagsChange.emit(this.selectedTag);
    this.cd.detectChanges();
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
