import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVED_SUPPORT_TAG } from 'src/app/const/confirm';
import { SupportPageCategoriesService } from '../../../services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesStateService } from '../../../state/support-page-categories/support-page-categories-state.service';
import { SupportPageInfoTag } from './class/support-page-info-tag';

@Component({
  selector: 'support-page-info-tags',
  templateUrl: './support-page-info-tags.component.html',
  styleUrls: ['./support-page-info-tags.component.scss']
})
export class SupportPageInfoTagsComponent implements OnInit {
  @Input() selectedTag: Array<SupportPageInfoTag> = [];
  @Output() tagsChange = new EventEmitter();
  tags: Array<SupportPageInfoTag> = [];
  reqTags: Array<SupportPageInfoTag> = [];
  newTag: string = "";
  sub: Subscription = new Subscription();
  constructor(private supportPageCategoriesService: SupportPageCategoriesService,
    private modalService: NgbModal,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
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
  }
  onSearch(event) {
    this.tags = this.reqTags.filter(item => item.word.toLowerCase().includes(event.target.value.toLowerCase()));

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
    this.newTag = "";
  }

  onRemoveTag(id) {
    this.supportPageCategoriesService.removeTag(id).subscribe(data => {

    })
  }
  removeTag(tag) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_TAG);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete?`;
    this.supportPageCategoriesStateService.setTagForRemove(tag);

  }
  addTag() {
    if (this.newTag.length > 0) {
      this.supportPageCategoriesService.addTag({
        word: this.newTag, defaultTag
          : "SUPPORT"
      }).subscribe(data => {

      })
    }
  }
}
