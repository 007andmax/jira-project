import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SupportPageCategory } from '../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesStateService } from '../state/support-page-categories/support-page-categories-state.service';
var $ = require("jquery");
@Component({
  selector: 'support-page',
  templateUrl: './support-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./support-page.component.scss']
})
export class SupportPageComponent implements OnInit {
  isShowHelpCenter: boolean = true;
  categories: Array<SupportPageCategory> = [];
  sub: Subscription = new Subscription();
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    public cd: ChangeDetectorRef,
    public documentsService: DocumentsService,
    public activateRoute: ActivatedRoute,
    public companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.isShowHelpCenter = this.supportPageCategoriesStateService.getShowHelpCenter();
    this.supportPageCategoriesStateService.onToggleShowHelpCenter.subscribe(data => {
      this.isShowHelpCenter = data;
      this.cd.markForCheck();
    })
    this.supportPageCategoriesStateService.onShowHelpCenter.subscribe(data => {
      this.isShowHelpCenter = true;
      this.cd.markForCheck();
    })
    this.categories = JSON.parse(JSON.stringify(this.supportPageCategoriesStateService.getCategories())).map(item => new SupportPageCategory(item));
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = JSON.parse(JSON.stringify(data)).map(item => new SupportPageCategory(item));
      this.cd.markForCheck();
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
  public trackById(index, item) {
    return item.id;
  }
}
