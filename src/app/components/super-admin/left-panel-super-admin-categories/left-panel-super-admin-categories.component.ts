import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { SupportPageCategoriesService } from '../services/support-page-categories/support-page-categories.service';
import { SupportPageAddCategoryComponent } from '../shared/support-page-add-category/support-page-add-category.component';
import { SupportPageAddSubCategoryComponent } from '../shared/support-page-add-sub-category/support-page-add-sub-category.component';
import { SupportPageEditCategoryComponent } from '../shared/support-page-edit-category/support-page-edit-category.component';
import { SupportPageCategoriesRealTimeService } from '../state/support-page-categories/support-page-categories-real-time.service';
import { SupportPageCategoriesStateService } from '../state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategory } from './class/support-page-category';

@Component({
  selector: 'left-panel-super-admin-categories',
  templateUrl: './left-panel-super-admin-categories.component.html',
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
    this.supportPageCategoriesStateService.onPreviewContent.subscribe(data => {
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
    })
    this.supportPageCategoriesStateService.onGetCategories.subscribe(data => {
      this.categories = data;
      this.cd.detectChanges();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVED_SUPPORT_CATEGORY) {
          this.onRemoveCategory(this.supportPageCategoriesStateService.getCategoryForRemove().id);
        }

      }
    })
    this.sub.add(getConfirm);
    this.supportPageCategoriesStateService.onShowHelpCenter.subscribe(data => {
      this.isShowHelpCenter = true;
    })
  }
  editArticle(category) {
    if (category.document) {
      //this.supportPageCategoriesStateService.addArticle(category);
      this.selectedCategory = category;
      if (this.isShowHelpCenter) this.supportPageCategoriesStateService.setMode("EDIT");
      this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`, this.selectedCategory.id]);

    }
  }
  add() {
    const modalRef = this.modalService.open(SupportPageAddCategoryComponent, { windowClass: 'xs-modal user-modal' });
  }
  onRemoveCategory(id) {
    this.supportPageCategoriesService.removeCategory(id).subscribe(data => {

    })
  }

  onDropEnd(data) {
    this.supportPageCategoriesService.moveCategory(data.id, data.index).subscribe(data => {
    })
  }
  /* public goToCategory(id) {
     this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`, id]);
   }*/
  gotoHelpCenter() {
    // this.supportPageCategoriesStateService.showHelpCenter();
    this.isShowHelpCenter = true;
    this.selectedCategory = null;
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`]);
    this.supportPageCategoriesStateService.toggleShowHelpCenter(true);
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
