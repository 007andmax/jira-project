import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupportPageCategoriesService } from '../services/support-page-categories/support-page-categories.service';
import { SupportPageAddCategoryComponent } from '../shared/support-page-add-category/support-page-add-category.component';
import { SupportPageAddSubCategoryComponent } from '../shared/support-page-add-sub-category/support-page-add-sub-category.component';
import { SupportPageCategory } from './class/support-page-category';

@Component({
  selector: 'left-panel-super-admin-categories',
  templateUrl: './left-panel-super-admin-categories.component.html',
  styleUrls: ['./left-panel-super-admin-categories.component.scss']
})
export class LeftPanelSuperAdminCategoriesComponent implements OnInit {
  categories: Array<SupportPageCategory> = [];
  constructor(private modalService: NgbModal,
    private supportPageCategoriesService: SupportPageCategoriesService) { }

  ngOnInit() {
    this.supportPageCategoriesService.getCategories().subscribe((data: any) => {
      console.log("data", data);
      this.categories = data.map(item => new SupportPageCategory(item));
    })
  }
  add() {
    const modalRef = this.modalService.open(SupportPageAddCategoryComponent, { windowClass: 'xs-modal user-modal' });
  }
  addSubCategory(id) {
    const modalRef = this.modalService.open(SupportPageAddSubCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.parentSupportCategoryId = id;
  }
}
