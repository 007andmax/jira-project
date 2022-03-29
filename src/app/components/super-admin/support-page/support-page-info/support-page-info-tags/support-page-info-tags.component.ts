import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVED_SUPPORT_TAG } from 'src/app/const/confirm';
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
  @Input() selectedTag: Array<string> = [];
  @Output() tagsChange = new EventEmitter();
  tags: Array<SupportPageInfoTag> = [];
  reqTags: Array<SupportPageInfoTag> = [];
  newTag: string = "";
  sub: Subscription = new Subscription();
  constructor(private supportPageCategoriesService: SupportPageCategoriesService,
    private modalService: NgbModal,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private tagsRealTimeService: TagsRealTimeService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
    this.supportPageCategoriesService.getTags().subscribe((data: any) => {
      this.tags = JSON.parse(JSON.stringify(data)).map(item => new SupportPageInfoTag(item));
      this.reqTags = JSON.parse(JSON.stringify(data)).map(item => new SupportPageInfoTag(item));
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVED_SUPPORT_TAG) {
          this.onRemoveTag(this.supportPageCategoriesStateService.getTagForRemove().id);
        }

      }
    })
    this.sub.add(getConfirm);
    this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && Array.isArray(data.data)) this.reqTags = [...this.reqTags, ...data.data.map(item => new SupportPageInfoTag(item))];
      if (data.action === "TAG_SAVED" && !Array.isArray(data.data)) {
        let index = this.reqTags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.reqTags[index] = new SupportPageInfoTag(data.data);
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.reqTags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.reqTags.splice(index, 1);
      }
      if (this.newTag.length == 0) this.tags = JSON.parse(JSON.stringify(this.reqTags)).map(item => new SupportPageInfoTag(item));
    })
  }
  onSearch(event) {
    this.tags = this.reqTags.filter(item => item.word.toLowerCase().includes(event.target.value.toLowerCase()));

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
  }

  onRemoveTag(id) {
    this.supportPageCategoriesService.removeTag(id).subscribe(data => {

    })
  }
  editTag(id, event) {
    console.log("event.target.value", $(event.target).parents(".company-tag-item"))
    let val = $(event.target).parents(".company-tag-item").find(".text-content input").val();
    console.log("val", val);
    if (val.length < 0) {
      this.supportPageCategoriesService.editTag(id, val).subscribe(data => {

      })
    }

  }
  removeTag(tag) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_TAG);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete?`;
    this.supportPageCategoriesStateService.setTagForRemove(tag);

  }
  getSelectedTag(id) {
    return (this.reqTags.length > 0) ? this.reqTags.find(item => item.id === id) : '';
  }
  addTag() {
    if (this.newTag.length > 0) {
      this.supportPageCategoriesService.addTag({
        word: this.newTag, defaultTag
          : "SUPPORT"
      }).subscribe(data => {
        this.newTag = "";
        this.tags = JSON.parse(JSON.stringify(this.reqTags)).map(item => new SupportPageInfoTag(item));
      })
    }
  }
}
