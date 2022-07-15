import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
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
  @Input() disabledAddSub: boolean = false;
  @Output() onSelectCategory = new EventEmitter();
  constructor(private modalService: NgbModal,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private router: Router,
    public cd: ChangeDetectorRef,
    public companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
  }

  addSubCategory(id) {
    const modalRef = this.modalService.open(SupportPageAddSubCategoryComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.parentSupportCategoryId = id;
    this.cd.detectChanges();
  }
  editCategory(category) {
    const modalRef = this.modalService.open(SupportPageEditCategoryComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.category_id = category.id;
    modalRef.componentInstance.name = category.name;
    this.cd.detectChanges();
  }
  addArticle() {
    this.supportPageCategoriesStateService.setMode("EDIT");
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/support-page`, this.category.id]);
    this.cd.detectChanges();
    this.onSelectCategory.emit(this.category);
  }
  delete(category) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_CATEGORY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to delete the category?`;
    this.supportPageCategoriesStateService.setCategoryForRemove(category);
    this.cd.detectChanges();
  }
}
