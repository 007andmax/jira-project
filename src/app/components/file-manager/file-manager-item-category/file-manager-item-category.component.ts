import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileManagerCategory } from '../class/file-manager-category';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { FileManagerCategoryRenameComponent } from '../file-manager-category-rename/file-manager-category-rename.component';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";

@Component({
  selector: 'app-file-manager-item-category',
  templateUrl: './file-manager-item-category.component.html',
  styleUrls: ['./file-manager-item-category.component.scss']
})
export class FileManagerItemCategoryComponent implements OnInit {
  @ViewChild('db') db: NgbDropdown;
  @Input() isRemove: boolean = false;
  @Input() item: FileManagerCategory;
  @Input() isRemove: boolean = true;
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
    if (!this.item.allCompaniesRoot) {
      if (this.item.id) this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-manager/category/`, this.item.id]);
      if (!this.item.id && this.item.companyId) this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-manager/all-customer/`, this.item.companyId]);
    } else {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-manager/all-customer`]);
    }
  }
  removeCategory() {
    this.onRemove.emit(this.item);
  }
  getCreateBy() {
    return this.item.createdAt ? moment(new Date(this.item.createdAt)).format('DD MMM YYYY hh:mm A') : '';
  }
  rename() {
    const modalRef = this.modalService.open(FileManagerCategoryRenameComponent, { windowClass: 'xs-modal user-modal', container: "app-file-manager", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.item = this.item;
  }

}
