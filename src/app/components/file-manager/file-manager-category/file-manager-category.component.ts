import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileManagerCategory } from '../class/file-manager-category';
import { FileManagerFile } from '../class/file-manager-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { BreadcrumbsItem } from '../class/breadcrumbs-item';
import { fadeInAnimation } from 'src/app/animations';
import { FileManagerFileInfoComponent } from '../file-manager-file-info/file-manager-file-info.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
    selector: 'app-file-manager-category',
    templateUrl: './file-manager-category.component.html',
    styleUrls: ['./file-manager-category.component.scss'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    standalone: true,
})
export class FileManagerCategoryComponent implements OnInit, OnDestroy {
  sort: string = "Date";
  fileInfo: FileManagerFile;
  cateforyInfo: FileManagerFile;
  showPreloader: boolean = true;
  toggleFileInfo: boolean = false;
  categoryId: string;
  companyId: string;
  breadcrumbs: Array<BreadcrumbsItem> = [];
  categories: Array<FileManagerCategory> = [];
  files: Array<FileManagerFile> = [];
  groupedByCreateAt: { [key: string]: FileManagerFile[] } = {};
  sub: Subscription = new Subscription();
  @ViewChild('fileInfoContainer', { static: false }) fileInfoContainer: FileManagerFileInfoComponent;
  constructor(public fileManagementService: FileManagementService,
    public activateRoute: ActivatedRoute,
    public leftPanelStateService: LeftPanelStateService,
    public fileManagementRealTimeService: FileManagementRealTimeService,
    public fileManagementStateService: FileManagementStateService,
    public cd: ChangeDetectorRef,
    public confirmStateService: ConfirmStateService,
    public modalService: NgbModal,
    public companiesStateService: CompaniesStateService,
  ) {

  }


  ngOnInit() {
    this.categoryId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.categoryId = params['id'];
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
    if (!data) {
      this.fileInfo = null;
      this.cateforyInfo = null;
    }
  }
  getList() {
    this.fileManagementService.getFileManagement(this.categoryId).subscribe((data: any) => {
      this.breadcrumbs = data.breadcrumbs.map(item => new BreadcrumbsItem(item));
      this.companyId = this.breadcrumbs[this.breadcrumbs.length - 1].companyId;
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
  onSort(data) {
    this.sort = data;
  }
  sortKeyObject() {
    return Object.keys(this.groupedByCreateAt).sort((a, b) => (new Date(a) > new Date(b)) ?
      1 : ((new Date(b) > new Date(a)) ? -1 : 0)).reverse();
  }
  getCreateBy(item) {
    return moment(new Date(item)).format('DD MMM YYYY');
  }
  removeCategory(item) {
    this.fileManagementService.removeCategory(item.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  removeFile(item) {
    this.fileManagementService.removeFile(item.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.fileManagementStateService.removeFile(item.id);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  onRemoveFile(data) {
    this.confirmStateService.setConfirmAction(REMOVE_FILE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete File`;
    modalRef.componentInstance.message = `Are you sure you want to delete this file?`;
    this.fileManagementStateService.setFileForRemove(data);
  }
  onRemoveCategory(data) {
    this.confirmStateService.setConfirmAction(REMOVE_CATEGORY_FILES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Folder`;
    modalRef.componentInstance.message = `Are you sure you want to delete this folder?`;
    this.fileManagementStateService.setCategoryForRemove(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
