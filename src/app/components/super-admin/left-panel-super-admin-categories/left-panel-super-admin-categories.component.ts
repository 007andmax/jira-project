import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { SupportPageCategoriesService } from '../services/support-page-categories/support-page-categories.service';
import { SupportPageAddCategoryComponent } from '../shared/support-page-add-category/support-page-add-category.component';
import { SupportPageCategoriesStateService } from '../state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategory } from './class/support-page-category';

@Component({
  selector: 'left-panel-super-admin-categories',
  templateUrl: './left-panel-super-admin-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./left-panel-super-admin-categories.component.scss']
})
export class LeftPanelSuperAdminCategoriesComponent implements OnInit, OnDestroy {
  categories: Array<SupportPageCategory> = [];
  selectedCategory: SupportPageCategory;
  isShowHelpCenter: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private modalService: NgbModal,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private confirmStateService: ConfirmStateService,
    public companiesStateService: CompaniesStateService,
    private router: Router,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    let onPreviewContent = this.supportPageCategoriesStateService.onPreviewContent.subscribe(data => {
      this.selectedCategory = data;
      this.isShowHelpCenter = false;
      this.categories.forEach(category => {
        if (category.id === this.selectedCategory.id) {
          category.toggleSubCategory = true;
        }
        category.subcategories.forEach(subcategory => {
          if (subcategory.id === this.selectedCategory.id) {
            category.toggleSubCategory = true;
            subcategory.toggleSubCategory = true;
          }
          subcategory.subcategories.forEach(subsubcategory => {
            if (subsubcategory.id === this.selectedCategory.id) {
              category.toggleSubCategory = true;
              subcategory.toggleSubCategory = true;
              subsubcategory.toggleSubCategory = true;
            }
            subsubcategory.subcategories.forEach(subsubsubcategory => {
              if (subsubsubcategory.id === this.selectedCategory.id) {
                category.toggleSubCategory = true;
                subcategory.toggleSubCategory = true;
                subsubcategory.toggleSubCategory = true;
                subsubsubcategory.toggleSubCategory = true;
              }

            })
          })
        })
      })
      this.cd.markForCheck();
    })
    this.sub.add(onPreviewContent);
    this.categories = this.supportPageCategoriesStateService.getCategories();
    let onGetCategories = this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.markForCheck();
    })
    this.sub.add(onGetCategories);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVED_SUPPORT_CATEGORY) {
          this.onRemoveCategory(this.supportPageCategoriesStateService.getCategoryForRemove().id);
        }
      }
    })
    this.sub.add(getConfirm);
    let onShowHelpCenter = this.supportPageCategoriesStateService.onShowHelpCenter.subscribe(data => {
      this.isShowHelpCenter = true;
      this.cd.markForCheck();
    })
    this.sub.add(onShowHelpCenter);
  }
  editArticle(category) {
    if (category.document) {
      this.selectedCategory = category;
      if (this.isShowHelpCenter) this.supportPageCategoriesStateService.setMode("EDIT");
      this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/support-page`, this.selectedCategory.id]);
      this.cd.detectChanges();
    }
  }
  add() {
    const modalRef = this.modalService.open(SupportPageAddCategoryComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    this.cd.detectChanges();
  }
  onRemoveCategory(id) {
    this.supportPageCategoriesService.removeCategory(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }

  onDropEnd(data) {
    this.supportPageCategoriesService.moveCategory(data.id, data.index).subscribe(data => {
      this.cd.markForCheck();
    })
  }
  setTooltipContent(tooltip, type) {
    tooltip.content = (type === 'PUBLISHED') ? 'Published' : 'Draft';
    this.cd.detectChanges();
  }
  gotoHelpCenter() {
    this.isShowHelpCenter = true;
    this.selectedCategory = null;
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/support-page`]);
    this.supportPageCategoriesStateService.toggleShowHelpCenter(true);
    this.cd.detectChanges();
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
