import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVED_SUPPORT_TAG } from 'src/app/const/confirm';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { SupportPageCategoriesService } from '../../../services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesStateService } from '../../../state/support-page-categories/support-page-categories-state.service';
import { SupportPageInfoTag } from './class/support-page-info-tag';
var $ = require("jquery");

@Component({
  selector: 'support-page-info-tags',
  templateUrl: './support-page-info-tags.component.html',
  styleUrls: ['./support-page-info-tags.component.scss']
})
export class SupportPageInfoTagsComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() selectedTag: Array<string> = [];
  @ViewChild('dp', { static: true }) dp: NgbDropdown;
  @Output() tagsChange = new EventEmitter();
  tags: Array<SupportPageInfoTag> = [];
  reqTags: Array<SupportPageInfoTag> = [];
  newTag: string = "";
  sub: Subscription = new Subscription();
  constructor(private supportPageCategoriesService: SupportPageCategoriesService,
    private modalService: NgbModal,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private tagsRealTimeService: TagsRealTimeService,
    public cd: ChangeDetectorRef,
    public appStateService: AppStateService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
    this.supportPageCategoriesService.getTags().subscribe((data: any) => {
      this.tags = JSON.parse(JSON.stringify(data)).map(item => new SupportPageInfoTag(item));
      this.reqTags = JSON.parse(JSON.stringify(data)).map(item => new SupportPageInfoTag(item));
      this.tags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.reqTags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.cd.markForCheck();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVED_SUPPORT_TAG) {
          this.onRemoveTag(this.supportPageCategoriesStateService.getTagForRemove().id);
        }
      }
    })
    this.sub.add(getConfirm);
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && Array.isArray(data.data)) {
        data.data.forEach(item => {
          let index = this.reqTags.findIndex(tag => tag.id == item.id);
          if (index > -1) this.reqTags[index].setData(item);
          if (index == -1) this.reqTags.push(new SupportPageInfoTag(item));
        })
      }
      if (data.action === "TAG_SAVED" && !Array.isArray(data.data)) {
        let index = this.reqTags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.reqTags[index].setData(data.data);
        if (index == -1) this.reqTags.push(new SupportPageInfoTag(data.data));
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.reqTags.findIndex(item => item.id === data.data);
        if (index > -1) this.reqTags.splice(index, 1);
        let indexTag = this.tags.findIndex(item => item.id === data.data);
        if (indexTag > -1) this.tags.splice(indexTag, 1);
        let indexSelected = this.selectedTag.findIndex(item => item === data.data);
        if (indexSelected > -1) this.selectedTag.splice(indexSelected, 1);
      }
      if (this.newTag.length == 0) this.tags = JSON.parse(JSON.stringify(this.reqTags)).map(item => new SupportPageInfoTag(item));
      if (this.newTag.length > 0) this.tags.forEach(item => {
        let index = this.reqTags.findIndex(tag => tag.id === item.id);
        if (index > -1) item.setData(JSON.parse(JSON.stringify(this.reqTags[index])));
        if (index == -1) this.tags.push(new SupportPageInfoTag(JSON.parse(JSON.stringify(item))));
      })
      this.tags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.reqTags.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();
    })
    this.sub.add(changeTagsArray);
  }
  onSearch(event) {
    this.tags = this.reqTags.filter(item => item.word.toLowerCase().includes(event.target.value.toLowerCase()));
    this.cd.markForCheck();
  }
  isSeleted(item) {
    return this.selectedTag.find(element => element === item.id);
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedTag.findIndex(item => item === newItem.id);
    if (findIndex > -1) {
      this.selectedTag.splice(findIndex, 1);
    } else {
      this.selectedTag.push(newItem.id);
      this.tags = this.reqTags;
    }
    this.tagsChange.emit(this.selectedTag);
    this.newTag = "";
    this.cd.markForCheck();
  }
  opeDropDown() {
    if (!this.dp.isOpen()) this.dp.open();
  }
  onRemoveTag(id) {
    this.supportPageCategoriesService.removeTag(id).subscribe(data => {
    })
  }
  editTag(id, event) {
    let val = $(event.target).parents(".company-tag-item").find(".text-content input").val();
    if (val.length > 0) {
      this.supportPageCategoriesService.editTag(id, val).subscribe(data => {
      })
    }
  }
  removeTag(tag) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_TAG);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to delete?`;
    this.supportPageCategoriesStateService.setTagForRemove(tag);
    this.cd.detectChanges();
  }
  getSelectedTag(id) {
    return (this.reqTags.length > 0) ? this.reqTags.find(item => item.id === id).word : '';
  }
  addTag() {
    if (this.newTag.length > 0) {
      this.supportPageCategoriesService.addTag({
        word: this.newTag, defaultTag
          : "SUPPORT"
      }).subscribe(data => {
        this.newTag = "";
        this.tags = JSON.parse(JSON.stringify(this.reqTags)).map(item => new SupportPageInfoTag(item));
        this.cd.markForCheck();
      })
    }
  }
  onCloseTags(data) {
    if (data) {
      this.tags.forEach(item => item.setEditMode(false));
      this.cd.markForCheck();
    }
  }
  public trackById(index, item) {
    return item.id;
  }
}
