import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
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

@Component({
  selector: 'app-file-management-category',
  templateUrl: './file-management-category.component.html',
  styleUrls: ['./file-management-category.component.scss']
})
export class FileManagementCategoryComponent implements OnInit {
  sort: string = "Date";
  showPreloader: boolean = true;
  categoryId: string;
  breadcrumbs: Array<BreadcrumbsItem> = [];
  categories: Array<FileManagementCategory> = [];
  files: Array<FileManagementFile> = [];
  groupedByCreateAt: { [key: string]: FileManagementFile[] } = {};
  sub: Subscription = new Subscription();
  constructor(private fileManagementService: FileManagementService,
    private activateRoute: ActivatedRoute,
    private leftPanelStateService: LeftPanelStateService,
    public fileManagementRealTimeService: FileManagementRealTimeService,
    public fileManagementStateService: FileManagementStateService,
    public cd: ChangeDetectorRef,
    public confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
  ) {
    this.categoryId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.categoryId = params['id'];
      this.getList();
    });
    this.sub.add(subscription);
  }

  ngOnInit() {
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
    this.fileManagementService.getFileManagement(this.categoryId).subscribe((data: any) => {
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
      this.showPreloader = false;
    })
  }
  onSort(data) {
    this.sort = data;
  }
  sortKeyObject() {
    return Object.keys(this.groupedByCreateAt).sort().reverse();
  }
  getCreateBy(item) {
    return moment(new Date(item)).format('DD MMM YYYY');
  }
  removeCategory(item) {
    this.fileManagementService.removeCategory(item.id).subscribe(data => {
    })
  }
  removeFile(item) {
    this.fileManagementService.removeFile(item.id).subscribe(data => {
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
}
