import { Component, OnInit } from '@angular/core';
import { FileManagementComponent } from '../file-management.component';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';

@Component({
  selector: 'app-file-management-all-customer',
  templateUrl: './file-management-all-customer.component.html',
  styleUrls: ['./file-management-all-customer.component.scss']
})
export class FileManagementAllCustomerComponent extends FileManagementComponent {

  ngOnInit() {
    this.fileManagementService.getFileManagement(null, true).subscribe((data: any) => {
      this.categories = data.categories.map(item => new FileManagementCategory(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

      console.log("groupedByCreateAt", this.groupedByCreateAt);
      this.showPreloader = false;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_FILES) this.removeCategory(this.fileManagementStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_FILE) this.removeFile(this.fileManagementStateService.getFileForRemove());

      }
    })
    this.sub.add(getConfirm);
    let onChangeDocument = this.fileManagementRealTimeService.changeArray.subscribe(data => {
      if (data.action === "CREATE_FILE_MANAGEMENT_CATEGORY") this.categories.push(new FileManagementCategory(data.data));
      if (data.action === "CREATE_MANAGEMENT_FILE") this.files.push(new FileManagementFile(data.data));
      if (data.action === "EDIT_FILE_MANAGEMENT_CATEGORY") {
        let findIndex = this.categories.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.categories[findIndex] = new FileManagementCategory(data.data);
      }
      if (data.action === "EDIT_MANAGEMENT_FILE") {
        let findIndex = this.files.findIndex(item => item.id === data.data.id);
        if (findIndex > -1) this.files[findIndex] = new FileManagementFile(data.data);
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

}
