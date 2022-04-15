import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { SupportPageAddSubCategoryComponent } from '../../shared/support-page-add-sub-category/support-page-add-sub-category.component';
import { SupportPageEditCategoryComponent } from '../../shared/support-page-edit-category/support-page-edit-category.component';
import { SupportPageCategoriesStateService } from '../../state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategory } from '../class/support-page-category';

@Component({
  selector: 'left-panel-super-admin-categories-actions',
  templateUrl: './left-panel-super-admin-categories-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./left-panel-super-admin-categories-actions.component.scss']
})
export class LeftPanelSuperAdminCategoriesActionsComponent implements OnInit {
  @Input() category: SupportPageCategory;
  @Output() onSelectCategory = new EventEmitter();
  @ViewChild('editCustomer') editCustomer: NgbDropdown;
  constructor(private modalService: NgbModal,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private router: Router,
    public cd: ChangeDetectorRef,
    private appStateService: AppStateService,
    public companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
  }

  addSubCategory(id) {
    const modalRef = this.modalService.open(SupportPageAddSubCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.parentSupportCategoryId = id;
  }
  editCategory(category) {
    const modalRef = this.modalService.open(SupportPageEditCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.category_id = category.id;
    modalRef.componentInstance.name = category.name;
  }
  addArticle(category) {
    // this.supportPageCategoriesStateService.addArticle(category);
    this.supportPageCategoriesStateService.setMode("EDIT");
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`, this.category.id]);
    this.cd.detectChanges();
    this.onSelectCategory.emit(this.category);
  }
  toggleDropDown() {
    //  this.editCustomer.open();
    // console.log("editCustomer", this.editCustomer.);
    //  this.cd.detectChanges();
  }
  delete(category) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_CATEGORY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete the category?`;
    this.supportPageCategoriesStateService.setCategoryForRemove(category);
  }
  onToggleDropDown(data) {
    console.log("onToggleDropDown", data);
    //  this.appStateService.changeDetectorRef();
  }
}
