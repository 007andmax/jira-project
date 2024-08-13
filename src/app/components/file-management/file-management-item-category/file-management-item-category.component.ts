import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { FileManagementCategoryRenameComponent } from '../file-management-category-rename/file-management-category-rename.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";

@Component({
  selector: 'app-file-management-item-category',
  templateUrl: './file-management-item-category.component.html',
  styleUrls: ['./file-management-item-category.component.scss']
})
export class FileManagementItemCategoryComponent implements OnInit {
  @Input() item: FileManagementCategory;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onFileInfo = new EventEmitter<any>();
  constructor(public router: Router,
    public companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }
  fileInfo() {
    this.onFileInfo.emit(this.item);
  }
  navigateToCategory() {
    console.log("this.item", this.item);
    if (!this.item.allCompaniesRoot) {
      if (this.item.id) this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-management/category/`, this.item.id]);
      if (!this.item.id && this.item.companyId) this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-management/all-customer/`, this.item.companyId]);
    } else {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-management/all-customer`]);
    }
  }
  removeCategory() {
    this.onRemove.emit(this.item);
  }
  getCreateBy() {
    return moment(new Date(this.item.createdAt)).format('DD MMM YYYY');
  }
  rename() {
    const modalRef = this.modalService.open(FileManagementCategoryRenameComponent, { windowClass: 'xs-modal user-modal', container: "app-file-management", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.item = this.item;
  }

}
