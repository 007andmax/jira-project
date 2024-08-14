import { Component, OnInit } from '@angular/core';
import { FileManagementComponent } from '../file-management.component';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'app-file-management-all-customer',
  templateUrl: './file-management-all-customer.component.html',
  styleUrls: ['./file-management-all-customer.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },

})
export class FileManagementAllCustomerComponent extends FileManagementComponent {
  companyArchived: boolean;
  ngOnInit() {
    this.getFileManagement();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_FILES) this.removeCategory(this.fileManagementStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_FILE) this.removeFile(this.fileManagementStateService.getFileForRemove());

      }
    })
    this.sub.add(getConfirm);
    let onAddFile = this.fileManagementStateService.onAddFile.subscribe(data => {
      let isExist = this.files.some(item => item.id == data.id);
      if (!isExist) {
        this.files.push(new FileManagementFile(data));
        this.groupedByCreateAt[data.createdAt].push(new FileManagementFile(data));
      }
    })
    this.sub.add(onAddFile);
    let onAddCategory = this.fileManagementStateService.onAddCategory.subscribe(data => {
      let isExist = this.categories.some(item => item.id == data.id);
      if (!isExist) this.categories.push(new FileManagementCategory(data));
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
        this.files[findIndex] = new FileManagementFile(data);
        let indexGroup = this.groupedByCreateAt[data.createdAt].findIndex(item => item.id === data.id);
        if (indexGroup > -1) this.groupedByCreateAt[data.createdAt][indexGroup] = new FileManagementFile(data);
      }
    })
    this.sub.add(onEditFile);
    let onEditCategory = this.fileManagementStateService.onEditCategory.subscribe(data => {
      let findIndex = this.categories.findIndex(item => item.id === data.id);
      if (findIndex > -1) this.categories[findIndex] = new FileManagementCategory(data);
    })
    this.sub.add(onEditCategory);
    let onChangeDocument = this.fileManagementRealTimeService.changeArray.subscribe(data => {
      if (data.action === "CREATE_FILE_MANAGEMENT_CATEGORY") {
        let isExist = this.files.some(item => item.id == data.data.id);
        if (!isExist) this.categories.push(new FileManagementCategory(data.data));
      } if (data.action === "CREATE_MANAGEMENT_FILE") {
        let isExist = this.files.some(item => item.id == data.data.id);
        if (!isExist) {
          this.files.push(new FileManagementFile(data.data));
          this.groupedByCreateAt[data.data.createdAt].push(new FileManagementFile(data.data));
        }
      }
      if (data.action === "EDIT_FILE_MANAGEMENT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.categories[findIndex] = new FileManagementCategory(data.data);
      }
      if (data.action === "EDIT_MANAGEMENT_FILE") {
        let findIndex = this.files.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) {
          this.files[findIndex] = new FileManagementFile(data.data);
          let indexGroup = this.groupedByCreateAt[data.data.createdAt].findIndex(item => item.id === data.data.id);
          if (indexGroup > -1) this.groupedByCreateAt[data.data.createdAt][indexGroup] = new FileManagementFile(data.data);
        }
      }
      if (data.action === "DELETE_FILE_MANAGEMENT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.categories.splice(findIndex, 1);
      }
      if (data.action === "DELETE_MANAGEMENT_FILE") {
        let findIndex = this.files.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.files.splice(findIndex, 1);
      }

      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
  }
  onChangeArchived(companyArchived) {
    this.companyArchived = companyArchived;
    this.getFileManagement();
  }
  getFileManagement() {
    this.showPreloader = true;
    this.categories = [];
    this.fileManagementService.getFileManagement(null, true, this.companyArchived).subscribe((data: any) => {
      this.categories = data.categories.map(item => new FileManagementCategory(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

      console.log("groupedByCreateAt", this.groupedByCreateAt);
      this.showPreloader = false;
    })
  }
}
