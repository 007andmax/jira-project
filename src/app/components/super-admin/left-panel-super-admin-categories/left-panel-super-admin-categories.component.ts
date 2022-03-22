import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
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
  sub: Subscription = new Subscription();
  constructor(private modalService: NgbModal,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private supportPageCategoriesRealTimeService: SupportPageCategoriesRealTimeService,
    private confirmStateService: ConfirmStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.supportPageCategoriesService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new SupportPageCategory(item));
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVED_SUPPORT_CATEGORY) {
          this.onRemoveCategory(this.supportPageCategoriesStateService.getCategoryForRemove().id);
        }

      }
    })
    this.sub.add(getConfirm);
    let changeCategoryArray = this.supportPageCategoriesRealTimeService.changeCategoryArray.subscribe(data => {
      if (data.action === "CREATE_SUPPORT_CATEGORY" && !data.data.parentSupportCategoryId) this.categories.push(new SupportPageCategory(data.data));
      if (data.action === "CREATE_SUPPORT_CATEGORY" && data.data.parentSupportCategoryId) {
        let add = false;
        this.categories.forEach(category => {
          if (category.id === data.data.parentSupportCategoryId && !add) {
            category.subcategories.push(new SupportPageCategory(data.data));
            console.log("category.subcategories", category.subcategories);
            add = true;
          }
          category.subcategories.forEach(subcategory => {
            if (subcategory.id === data.data.parentSupportCategoryId && !add) {
              subcategory.subcategories.push(new SupportPageCategory(data.data));
              console.log("subcategory.subcategories", subcategory.subcategories);
              add = true;
            }
            subcategory.subcategories.forEach(subsubcategory => {
              if (subsubcategory.id === data.data.parentSupportCategoryId && !add) {
                subsubcategory.subcategories.push(new SupportPageCategory(data.data));
                console.log("subsubcategory.subcategories", subsubcategory.subcategories);
                add = true;
              }

            })
          })
        })
        this.cd.detectChanges();
      }

      if (data.action === "EDIT_SUPPORT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.categories[findIndex].onUpdate(data.data);
      }
      if (data.action === "DELETE_SUPPORT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.categories.splice(findIndex, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeCategoryArray);
  }
  add() {
    const modalRef = this.modalService.open(SupportPageAddCategoryComponent, { windowClass: 'xs-modal user-modal' });
  }
  editCategory(category) {
    const modalRef = this.modalService.open(SupportPageEditCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.category_id = category.id;
    modalRef.componentInstance.name = category.name;
  }
  addSubCategory(id) {
    const modalRef = this.modalService.open(SupportPageAddSubCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.parentSupportCategoryId = id;
  }
  onRemoveCategory(id) {
    this.supportPageCategoriesService.removeCategory(id).subscribe(data => {

    })
  }
  delete(category) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_CATEGORY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete the category?`;
    this.supportPageCategoriesStateService.setCategoryForRemove(category);
  }

  onDropEnd(data) {
    console.log("data", data);
    this.supportPageCategoriesService.moveCategory(data.id, data.index).subscribe(data => {
    })
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
