import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagerCategory } from './class/file-manager-category';
import { FileManagerFile } from './class/file-manager-file';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { Subscription } from 'rxjs';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';
import * as moment from "moment";
import { fadeInAnimation } from 'src/app/animations';
import { FileManagerFileInfoComponent } from './file-manager-file-info/file-manager-file-info.component';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },

})
export class FileManagerComponent implements OnInit, OnDestroy {
  sort: string = "Date";
  toggleFileInfo: boolean = false;
  showPreloader: boolean = true;
  fileInfo: FileManagerFile;
  cateforyInfo: FileManagerFile;
  categories: Array<FileManagerCategory> = [];
  files: Array<FileManagerFile> = [];
  groupedByCreateAt: { [key: string]: FileManagerFile[] } = {};
  sub: Subscription = new Subscription();
  @ViewChild('fileInfoContainer') fileInfoContainer: FileManagerFileInfoComponent;
  constructor(public fileManagementService: FileManagementService,
    public confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public fileManagementStateService: FileManagementStateService,
    public fileManagementRealTimeService: FileManagementRealTimeService,
    public cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.fileManagementService.getFileManagement().subscribe((data: any) => {
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
      if (data.action === "CREATE_FILE_MANAGEMENT_CATEGORY") {
        let isExist = this.files.some(item => item.id == data.data.id);
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
  }
  sortKeyObject() {
    return Object.keys(this.groupedByCreateAt).sort((a, b) => (new Date(a) > new Date(b)) ?
      1 : ((new Date(b) > new Date(a)) ? -1 : 0)).reverse();
  }
  onSort(data) {
    this.sort = data;
  }
  getCreateBy(item) {
    return moment(new Date(item)).format('DD MMM YYYY');
  }
  onCategoryInfo(data) {
    this.fileInfo = null;
    this.cateforyInfo = data;
    this.toggleFileInfo = true;
    if (this.fileInfoContainer) this.fileInfoContainer.reset(null, this.cateforyInfo);
  }
  onFileInfo(data) {
    this.cateforyInfo = null;
    this.fileInfo = data;
    this.toggleFileInfo = true;
    if (this.fileInfoContainer) this.fileInfoContainer.reset(this.fileInfo, null);
  }
  onToggleFileInfo(data) {
    this.toggleFileInfo = data;
  }
  removeCategory(item) {
    this.fileManagementService.removeCategory(item.id).subscribe(data => {
      this.fileManagementStateService.removeCategory(item.id);
    })
  }
  removeFile(item) {
    this.fileManagementService.removeFile(item.id).subscribe(data => {
      this.fileManagementStateService.removeFile(item.id);
    })
  }
  onRemoveFile(data) {
    this.confirmStateService.setConfirmAction(REMOVE_FILE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to delete this file?`;
    this.fileManagementStateService.setFileForRemove(data);
  }
  onRemoveCategory(data) {
    this.confirmStateService.setConfirmAction(REMOVE_CATEGORY_FILES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.fileManagementStateService.setCategoryForRemove(data);
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
