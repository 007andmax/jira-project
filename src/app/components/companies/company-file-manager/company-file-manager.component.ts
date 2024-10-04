import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations/fade-in.animation';
import { FileManagerComponent } from '../../file-manager/file-manager.component';
import { FileManagerCategory } from '../../file-manager/class/file-manager-category';
import { FileManagerFile } from '../../file-manager/class/file-manager-file';
import * as moment from "moment";
import { BreadcrumbsItem } from '../../file-manager/class/breadcrumbs-item';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';

@Component({
  selector: 'app-company-file-manager',
  templateUrl: './company-file-manager.component.html',
  styleUrls: ['./company-file-manager.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
})
export class CompanyFileManagerComponent extends FileManagerComponent {
  companyId: string;
  breadcrumbs: Array<BreadcrumbsItem> = [];
  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-file-manager');
    this.companyId = this.activateRoute.snapshot.params['id'];
    if (this.companyId) this.companiesStateService.setCompanyRoutingId(this.companyId);
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      if (this.companyId) this.companiesStateService.setCompanyRoutingId(this.companyId);
      this.getFileManagement();
    });
    this.sub.add(subscription);
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
      if (data.action === "CREATE_FILE_MANAGEMENT_CATEGORY" && this.companyId == data.data.companyId) {
        let isExist = this.categories.some(item => item.id == data.data.id);
        if (!isExist) this.categories.push(new FileManagerCategory(data.data));
      }
      if (data.action === "CREATE_MANAGEMENT_FILE" && this.companyId == data.data.companyId) {
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
  }
  getFileManagement() {
    this.fileManagementService.getFileManagement(null, null, null, this.companyId).subscribe((data: any) => {
      this.breadcrumbs = data.breadcrumbs.map(item => new BreadcrumbsItem(item));
      this.categories = data.categories.map(item => new FileManagerCategory(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.files = data.files.map(item => new FileManagerFile(item)).sort((a, b) => (a.createdAt > b.createdAt) ?
        1 : ((b.createdAt > a.createdAt) ? -1 : 0));
      this.files.forEach(person => {
        let date = moment(new Date(person.createdAt)).format('DD MMM YYYY');
        if (!this.groupedByCreateAt[date]) this.groupedByCreateAt[date] = [];
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
}
