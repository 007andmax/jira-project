import { Component, OnInit } from '@angular/core';
import { SupportPageCategory } from '../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../services/support-page-categories/support-page-categories.service';
import { SupportPageCategoriesRealTimeService } from '../state/support-page-categories/support-page-categories-real-time.service';
import { SupportPageCategoriesStateService } from '../state/support-page-categories/support-page-categories-state.service';
import { HelpCenterCategory } from './class/help-center-category';
import { HelpCenterSubCategory } from './class/help-center-sub-category';
import { SupportPageCategoryContent } from './class/support-page-category-content';
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
  helpCenterCategories: Array<HelpCenterCategory> = [];
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,
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
      // this.cd.detectChanges();
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
  }
  onChangeContent(data) {
    this.supportPageCategoryContent.setNewContent(data);
  }
}
