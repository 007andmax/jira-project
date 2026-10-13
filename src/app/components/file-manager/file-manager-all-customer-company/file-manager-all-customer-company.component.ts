
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FileManagerCategoryComponent } from '../file-manager-category/file-manager-category.component';
import { BreadcrumbsItem } from '../class/breadcrumbs-item';
import { FileManagerCategory } from '../class/file-manager-category';
import { FileManagerFile } from '../class/file-manager-file';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';
import { fadeInAnimation } from 'src/app/animations';
import * as moment from "moment";
import { FileManagerFileInfoComponent } from '../file-manager-file-info/file-manager-file-info.component';
import { FileManagerHeaderComponent } from '../file-manager-header/file-manager-header.component';
import { FileManagerItemCategoryComponent } from '../file-manager-item-category/file-manager-item-category.component';
import { FileManagerItemFileComponent } from '../file-manager-item-file/file-manager-item-file.component';

@Component({
  standalone: true,
  imports: [FileManagerFileInfoComponent, FileManagerItemFileComponent, FileManagerItemCategoryComponent, FileManagerHeaderComponent, CommonModule],
  selector: 'app-file-manager-all-customer-company',
  templateUrl: './file-manager-all-customer-company.component.html',
  styleUrls: ['./file-manager-all-customer-company.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },

})
export class FileManagerAllCustomerCompanyComponent extends FileManagerCategoryComponent {
  companyId: string;

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      this.categories = [];
      this.files = [];
      this.groupedByCreateAt = {};
      this.getList();
    });
    this.sub.add(subscription);
    this.leftPanelStateService.changeStateWithoutNavigate("file-manager-category");
    let onAddFile = this.fileManagementStateService.onAddFile.subscribe(data => {
      let isExist = this.files.some(item => item.id == data.id);
      if (!isExist) {
        this.files.push(new FileManagerFile(data));
        let date = moment(new Date(data.createdAt)).format('DD MMM YYYY');
        if (!this.groupedByCreateAt[date]) this.groupedByCreateAt[date] = [];
        this.groupedByCreateAt[date].push(new FileManagerFile(data));
      }
    })
    this.sub.add(onAddFile);
    let onAddCategory = this.fileManagementStateService.onAddCategory.subscribe(data => {
      let isExist = this.categories.some(item => item.id == data.id);
      if (!isExist) this.categories.push(new FileManagerCategory(data));
    })
    this.sub.add(onAddCategory);
    let onRemoveFile = this.fileManagementStateService.onRemoveFile.subscribe(data => {
      let findIndex = this.files.findIndex(item => item.id === data);
      if (findIndex > -1) this.files.splice(findIndex, 1);
      for (const key in this.groupedByCreateAt) {
        let findIndex = this.groupedByCreateAt[key].findIndex(item => item.id === data);
        if (findIndex > -1) this.groupedByCreateAt[key].splice(findIndex, 1);
      }
    })
    this.sub.add(onRemoveFile);
    let onRemoveCategory = this.fileManagementStateService.onRemoveCategory.subscribe(data => {
      let findIndex = this.categories.findIndex(item => item.id === data);
      if (findIndex > -1) this.categories.splice(findIndex, 1);
    })
    this.sub.add(onRemoveCategory);
    let onEditFile = this.fileManagementStateService.onEditFile.subscribe(data => {
      let findIndex = this.files.findIndex(item => item.id === data.id);
      if (findIndex > -1) {
        this.files[findIndex] = new FileManagerFile(data);
        let date = moment(new Date(data.createdAt)).format('DD MMM YYYY');
        let indexGroup = this.groupedByCreateAt[date].findIndex(item => item.id === data.id);
        if (indexGroup > -1) this.groupedByCreateAt[date][indexGroup] = new FileManagerFile(data);
      }
    })
    this.sub.add(onEditFile);
    let onEditCategory = this.fileManagementStateService.onEditCategory.subscribe(data => {
      let findIndex = this.categories.findIndex(item => item.id === data.id);
      if (findIndex > -1) this.categories[findIndex] = new FileManagerCategory(data);
    })
    this.sub.add(onEditCategory);
    let onChangeDocument = this.fileManagementRealTimeService.changeArray.subscribe(data => {
      if (data.action === "CREATE_FILE_MANAGEMENT_CATEGORY") {
        let isExist = this.categories.some(item => item.id == data.data.id);
        if (!isExist) this.categories.push(new FileManagerCategory(data.data));
      }
      if (data.action === "CREATE_MANAGEMENT_FILE") {
        let isExist = this.files.some(item => item.id == data.data.id);
        if (!isExist) {
          this.files.push(new FileManagerFile(data.data));
          let date = moment(new Date(data.data.createdAt)).format('DD MMM YYYY');
          if (!this.groupedByCreateAt[date]) this.groupedByCreateAt[date] = [];
          this.groupedByCreateAt[date].push(new FileManagerFile(data.data));
        }
      }
      if (data.action === "EDIT_FILE_MANAGEMENT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.categories[findIndex] = new FileManagerCategory(data.data);
      }
      if (data.action === "EDIT_MANAGEMENT_FILE") {
        let findIndex = this.files.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) {
          this.files[findIndex] = new FileManagerFile(data.data);
          let date = moment(new Date(data.data.createdAt)).format('DD MMM YYYY');
          let indexGroup = this.groupedByCreateAt[date].findIndex(item => item.id === data.data.id);
          if (indexGroup > -1) this.groupedByCreateAt[date][indexGroup] = new FileManagerFile(data.data);
        }
      }
      if (data.action === "DELETE_FILE_MANAGEMENT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.categories.splice(findIndex, 1);
      }
      if (data.action === "DELETE_MANAGEMENT_FILE") {
        let findIndex = this.files.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.files.splice(findIndex, 1);
        for (const key in this.groupedByCreateAt) {
          let findIndex = this.groupedByCreateAt[key].findIndex(item => item.id === data.data);
          if (findIndex > -1) this.groupedByCreateAt[key].splice(findIndex, 1);
        }
      }

      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_FILES) this.removeCategory(this.fileManagementStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_FILE) this.removeFile(this.fileManagementStateService.getFileForRemove());

      }
    })
    this.sub.add(getConfirm);
  }
  getList() {
    this.fileManagementService.getFileManagement(null, null, null, this.companyId).subscribe((data: any) => {
      this.breadcrumbs = data.breadcrumbs.map(item => new BreadcrumbsItem(item));
      this.categories = data.categories.map(item => new FileManagerCategory(item));
      this.files = data.files.map(item => new FileManagerFile(item)).sort((a, b) => (a.parseCreatedAt() > b.parseCreatedAt()) ?
        1 : ((b.parseCreatedAt() > a.parseCreatedAt()) ? -1 : 0));
      this.files.forEach(person => {
        let date = moment(new Date(person.createdAt)).format('DD MMM YYYY');
        if (!this.groupedByCreateAt[date]) {
          this.groupedByCreateAt[date] = [];
        }
        this.groupedByCreateAt[date].push(person);
      });
      this.groupedByCreateAt = Object.keys(this.groupedByCreateAt).sort((a, b) => (new Date(a) > new Date(b)) ?
        1 : ((new Date(b) > new Date(a)) ? -1 : 0)).reverse().reduce(
          (obj, key) => {
            obj[key] = this.groupedByCreateAt[key];
            return obj;
          },
          {}
        );
      this.showPreloader = false;
    })
  }
  public trackById(index, item) {
    return item.id;
  }
}
