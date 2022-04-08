import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { SupportPageCategory } from '../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesRealTimeService } from '../state/support-page-categories/support-page-categories-real-time.service';
import { SupportPageCategoriesStateService } from '../state/support-page-categories/support-page-categories-state.service';
import { HelpCenterCategory } from './class/help-center-category';
import { HelpCenterSubCategory } from './class/help-center-sub-category';
import { SupportPageCategoryContent } from './class/support-page-category-content';
import { SupportPageHeaderComponent } from './support-page-header/support-page-header.component';
var $ = require("jquery");
@Component({
  selector: 'support-page',
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss']
})
export class SupportPageComponent implements OnInit {
  supportPageCategoryContent: SupportPageCategoryContent = new SupportPageCategoryContent();
  selectedCategory: SupportPageCategory;
  content: string = "";
  isPreview: boolean = false;
  isShowHelpCenter: boolean = true;
  categories: Array<SupportPageCategory> = [];
  helpCenterCategories: Array<HelpCenterCategory> = [];
  attachments = [];
  @ViewChild('header') header: SupportPageHeaderComponent;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    public documentsService: DocumentsService,
    private supportPageCategoriesService: SupportPageCategoriesService,) { }

  ngOnInit() {
    this.supportPageCategoriesRealTimeService.changeCategoryArray.subscribe(data => {
      if (data.action === "DELETE_SUPPORT_CATEGORY" && (this.selectedCategory && this.selectedCategory.id === data.data)) this.selectedCategory = null;
      if (data.action === "EDIT_SUPPORT_CATEGORY" && (this.selectedCategory && this.selectedCategory.id === data.data)) this.selectedCategory.onUpdate(data.data);
    });
    this.supportPageCategoriesStateService.onShowHelpCenter.subscribe(data => {
      this.isShowHelpCenter = true;
    })
    this.supportPageCategoriesStateService.onAddArticle.subscribe(data => {
      this.isShowHelpCenter = false;
      this.selectedCategory = data;
      if (this.selectedCategory.document) {
        this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
          this.supportPageCategoryContent.setEditMode(true);
          this.supportPageCategoryContent.setContent(content);
          this.supportPageCategoryContent.setTags(content.tags.map(item => item.id));
          this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
        })
      } else {
        this.supportPageCategoryContent.setEditMode(false);
        this.supportPageCategoryContent.setContent(null);
        this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
      }
    })
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.helpCenterCategories = [];
      data.forEach(category => {
        let subcategories: Array<HelpCenterSubCategory> = [];

        category.subcategories.forEach(subcategory => {

          subcategories.push(new HelpCenterSubCategory(subcategory.id, subcategory.name));
          subcategory.subcategories.forEach(subsubcategory => {
            subcategories.push(new HelpCenterSubCategory(subsubcategory.id, subsubcategory.name));
            subsubcategory.subcategories.forEach(subsubsubcategory => {
              subcategories.push(new HelpCenterSubCategory(subsubsubcategory.id, subsubsubcategory.name));
            })
          })
        })
        this.helpCenterCategories.push(new HelpCenterCategory(category.id, category.name, subcategories));
      });
      this.categories = JSON.parse(JSON.stringify(data)).map(item => new SupportPageCategory(item));
      this.cd.detectChanges();
    })
    const selectTarget = (fromElement, selector) => {
      if (!(fromElement instanceof HTMLElement)) {
        return null;
      }
      return fromElement.querySelector(selector);
    };
    const resizeData = {
      tracking: false,
      startWidth: null,
      startCursorScreenX: null,
      handleWidth: 10,
      resizeTarget: null,
      parentElement: null,
      maxWidth: null,
    };
    $(document.body).on('mousedown', '.resize-handle--x', null, (event) => {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const handleElement = event.currentTarget;
      if (!handleElement.parentElement) {
        console.error(new Error("Parent element not found."));
        return;
      }
      // Use the target selector on the handle to get the resize target.
      const targetSelector = handleElement.getAttribute('data-target');
      const targetElement = selectTarget(handleElement.parentElement, targetSelector);
      if (!targetElement) {
        console.error(new Error("Resize target element not found."));
        return;
      }
      resizeData.startWidth = $(targetElement).outerWidth();
      resizeData.startCursorScreenX = event.screenX;
      resizeData.resizeTarget = targetElement;
      resizeData.parentElement = handleElement.parentElement;
      resizeData.maxWidth = $(handleElement.parentElement).innerWidth() - resizeData.handleWidth;
      resizeData.tracking = true;
    });
    $(window).on('mousemove', null, null, (event) => {
      if (resizeData.tracking) {
        const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
        const newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
        if (newWidth >= 234) $(resizeData.resizeTarget).outerWidth(newWidth);
      }
    });
    $(window).on('mouseup', null, null, (event) => {
      if (resizeData.tracking) resizeData.tracking = false;
    });
  }
  onPreview(data) {
    this.isPreview = data;
    if (!this.isPreview) this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
    if (this.isPreview) {
      this.elRef.nativeElement.querySelector(".support-page-body__preview").innerHTML = "";
      this.elRef.nativeElement.querySelector(".support-page-body__preview").insertAdjacentHTML('afterbegin', this.supportPageCategoryContent.newContent);

    }
    // if (!this.isPreview && this.supportPageCategoryContent.isEditMode) this.supportPageCategoryContent.document.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
  }
  public showPreview(data) {
    if (data.document) {
      this.selectedCategory = data;
      this.supportPageCategoriesStateService.showPreview(this.selectedCategory);
      this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
        this.supportPageCategoryContent.setEditMode(true);
        this.supportPageCategoryContent.setContent(content);
        this.supportPageCategoryContent.setTags(content.tags.map(item => item.id));
        this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
        this.header.setPreview(true);
        this.isShowHelpCenter = false;
      })
    }
  }
  onChangeAttachments(data) {
    this.attachments = data;
  }
  checkAddAttachments() {
    let content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
    let contentAttachments = [];
    let removedAttachments = [];
    var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
    if (content) content.replace(urlRegex, function (url) {
      contentAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });

    console.log("contentAttachments", contentAttachments);
    console.log("removedAttachments", removedAttachments);
    console.log("attachments", this.attachments);
    this.attachments.forEach(item => {
      if (!contentAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
    })
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
  }
  checkEditAttachments() {
    let content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
    let newContent = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
    let oldAttachments = this.attachments;
    let newAttachments = [];
    let removedAttachments = [];
    var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
    if (content) content.replace(urlRegex, function (url) {
      oldAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    if (newContent) newContent.replace(urlRegex, function (url) {
      newAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    oldAttachments.forEach(item => {
      if (!newAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
    })
    console.log("oldAttachments", oldAttachments);
    console.log("newAttachments", newAttachments);
    console.log("removedAttachments", removedAttachments);
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));

    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
  }
  onChangeContent(data) {
    this.supportPageCategoryContent.setNewContent(data);
  }
  getContentPreview() {
    if (this.supportPageCategoryContent.newContent.length > 0) return this.supportPageCategoryContent.newContent;
    return this.content
  }
  public trackById(index, item) {
    return item.id;
  }
}
