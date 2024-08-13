import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FileManagementCategoryComponent } from '../file-management-category/file-management-category.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { BreadcrumbsItem } from '../class/breadcrumbs-item';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';

@Component({
  selector: 'app-file-management-all-customer-company',
  templateUrl: './file-management-all-customer-company.component.html',
  styleUrls: ['./file-management-all-customer-company.component.scss']
})
export class FileManagementAllCustomerCompanyComponent extends FileManagementCategoryComponent {
  companyId: string;

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      this.getList();
    });
    this.sub.add(subscription);
    this.leftPanelStateService.changeStateWithoutNavigate("file-management-category");
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
      this.categories = data.categories.map(item => new FileManagementCategory(item));
      this.files = data.files.map(item => new FileManagementFile(item)).sort((a, b) => (a.parseCreatedAt().toLowerCase() > b.parseCreatedAt().toLowerCase()) ?
        1 : ((b.parseCreatedAt().toLowerCase() > a.parseCreatedAt().toLowerCase()) ? -1 : 0));
      this.files.forEach(person => {
        if (!this.groupedByCreateAt[person.createdAt]) {
          this.groupedByCreateAt[person.createdAt] = [];
        }
        this.groupedByCreateAt[person.createdAt].push(person);
      });
      console.log("Object.keys(this.groupedByCreateAt).sort().reverse()", Object.keys(this.groupedByCreateAt).sort().reverse());
      this.groupedByCreateAt = Object.keys(this.groupedByCreateAt).sort().reverse().reduce(
        (obj, key) => {
          obj[key] = this.groupedByCreateAt[key];
          return obj;
        },
        {}
      );
      console.log("FileManagementAllCustomerCompanyComponent", this.breadcrumbs);
      this.showPreloader = false;
    })
  }
}
