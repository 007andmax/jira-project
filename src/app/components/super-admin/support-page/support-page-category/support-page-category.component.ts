import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { environment } from 'src/environments/environment';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesRealTimeService } from '../../state/support-page-categories/support-page-categories-real-time.service';
import { SupportPageCategoriesStateService } from '../../state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategoryContent } from '../class/support-page-category-content';
import { SupportPageBodyComponent } from '../support-page-body/support-page-body.component';
import { SupportPageHeaderComponent } from '../support-page-header/support-page-header.component';

@Component({
  selector: 'support-page-category',
  templateUrl: './support-page-category.component.html',
  styleUrls: ['./support-page-category.component.scss']
})
export class SupportPageCategoryComponent implements OnInit, OnDestroy {
  _id: string = '';
  content: string = "";
  isPreview: boolean = false;
  supportPageCategoryContent: SupportPageCategoryContent = new SupportPageCategoryContent();
  selectedCategory: SupportPageCategory;
  attachments = [];
  isFirstOpen: boolean = true;
  sub: Subscription = new Subscription();
  @ViewChild('header') header: SupportPageHeaderComponent;
  @ViewChild('body') body: SupportPageBodyComponent;
  constructor(public activateRoute: ActivatedRoute,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public documentsService: DocumentsService,
    public cd: ChangeDetectorRef,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService) { }


  ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      if (this._id) this.getCategories(this.supportPageCategoriesStateService.getCategories());
    });
    this.sub.add(subscription);
    if (this._id && this.isFirstOpen) this.getCategories(this.supportPageCategoriesStateService.getCategories());
    let onGetCategories = this.supportPageCategoriesStateService.onGetCategories.subscribe((data) => {
      if (this.isFirstOpen) this.getCategories(data);
    });
    this.sub.add(onGetCategories);
    this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
    let changeCategoryArray = this.supportPageCategoriesRealTimeService.changeCategoryArray.subscribe(data => {
      if (data.action === "DELETE_SUPPORT_CATEGORY" && (this.selectedCategory && this.selectedCategory.id === data.data)) this.selectedCategory = null;
      if (data.action === "EDIT_SUPPORT_CATEGORY" && (this.selectedCategory && this.selectedCategory.id === data.data)) this.selectedCategory.onUpdate(data.data);
      this.cd.markForCheck();
    });
    this.sub.add(changeCategoryArray);
  }
  getCategories(data) {
    if (data.length > 0) this.isFirstOpen = false;
    if (this.supportPageCategoriesStateService.getMode() === "PREVIEW") {
      this.isPreview = true;
      this.header.setPreview(true);
    }
    data.forEach(category => {
      if (this._id && this._id == category.id) {
        this.selectedCategory = category;
        if (this.supportPageCategoriesStateService.getMode() === "EDIT") this.initEditMode();
        if (this.supportPageCategoriesStateService.getMode() === "PREVIEW") this.initPreviewMode();
        this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
      }

      category.subcategories.forEach(subcategory => {
        if (this._id && this._id == subcategory.id) {
          this.selectedCategory = subcategory;
          if (this.supportPageCategoriesStateService.getMode() === "EDIT") this.initEditMode();
          if (this.supportPageCategoriesStateService.getMode() === "PREVIEW") this.initPreviewMode();
          this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
        }

        subcategory.subcategories.forEach(subsubcategory => {
          if (this._id && this._id == subsubcategory.id) {
            this.selectedCategory = subsubcategory;
            if (this.supportPageCategoriesStateService.getMode() === "EDIT") this.initEditMode();
            if (this.supportPageCategoriesStateService.getMode() === "PREVIEW") this.initPreviewMode();
            this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
          }
          subsubcategory.subcategories.forEach(subsubsubcategory => {
            if (this._id && this._id == subsubsubcategory.id) {
              this.selectedCategory = subsubsubcategory;
              if (this.supportPageCategoriesStateService.getMode() === "EDIT") this.initEditMode();
              if (this.supportPageCategoriesStateService.getMode() === "PREVIEW") this.initPreviewMode();
              this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
            }
          })
        })
      })
      this.cd.markForCheck();
    });
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
    this.attachments.forEach(item => {
      if (!contentAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
    })
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
    this.attachments = [];
    this.supportPageCategoryContent.setEditMode(true);
    this.supportPageCategoryContent.document.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));

  }
  checkEditAttachments() {
    let content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
    let newContent = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
    let oldAttachments = JSON.parse(JSON.stringify(this.attachments));
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
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
    this.supportPageCategoryContent.document.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
    this.attachments = [];
  }
  public initEditMode() {
    if (this.selectedCategory.document) {
      this.supportPageCategoriesStateService.showPreview(this.selectedCategory);
      this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
        this.supportPageCategoryContent.setEditMode(true);
        this.supportPageCategoryContent.setContent(content);
        this.supportPageCategoryContent.setIdTags(content.tags.map(item => item.id));
        this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
        this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
        this.cd.detectChanges();
      })
    } else {
      this.supportPageCategoryContent.setEditMode(false);
      this.supportPageCategoryContent.setContent(null);
      if (this.body) this.body.reset();
      this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
      this.cd.detectChanges();
    }

  }
  public initPreviewMode() {
    this.supportPageCategoriesStateService.showPreview(this.selectedCategory);
    this.supportPageCategoriesService.getContentCategory(this.selectedCategory.id).subscribe((content: any) => {
      this.supportPageCategoryContent.setEditMode(true);
      this.supportPageCategoryContent.setContent(content);
      this.supportPageCategoryContent.setIdTags(content.tags.map(item => item.id));
      this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.document.content));
      this.header.setPreview(true);
      this.supportPageCategoriesStateService.toggleShowHelpCenter(false);
      this.cd.detectChanges();
    })
  }
  onPreview(data) {
    this.isPreview = data;
    if (!this.isPreview && this.supportPageCategoryContent.newContent) this.content = JSON.parse(JSON.stringify(this.supportPageCategoryContent.newContent));
    if (this.isPreview) {
      this.elRef.nativeElement.querySelector(".support-page-body__preview").innerHTML = "";
      this.elRef.nativeElement.querySelector(".support-page-body__preview").insertAdjacentHTML('afterbegin', this.supportPageCategoryContent.parseContent(`${environment.apiUrl}/#/${this.companiesStateService.getCurrentCompany().techDomain}/support-page`));
      this.cd.detectChanges();
    }
  }
  onChangeContent(data) {
    this.supportPageCategoryContent.setNewContent(data);
  }
  onChangeAttachments(data) {
    this.attachments = data;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
