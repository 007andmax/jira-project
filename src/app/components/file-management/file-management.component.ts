import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementCategory } from './class/file-management-category';
import { FileManagementFile } from './class/file-management-file';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_CATEGORY_DOCUMENT, REMOVE_CATEGORY_FILES, REMOVE_FILE } from 'src/app/const/confirm';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { Subscription } from 'rxjs';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit, OnDestroy {
  toggleFileInfo: boolean = false;
  showPreloader: boolean = true;
  categories: Array<FileManagementCategory> = [];
  files: Array<FileManagementFile> = [];
  groupedByCreateAt: { [key: string]: FileManagementFile[] } = {};
  sub: Subscription = new Subscription();
  constructor(private fileManagementService: FileManagementService,
    public confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private fileManagementStateService: FileManagementStateService,
    private fileManagementRealTimeService: FileManagementRealTimeService,
    public cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.fileManagementService.getFileManagement().subscribe((data: any) => {
      this.categories = data.categories.map(item => new FileManagementCategory(item));
      this.files = data.files.map(item => new FileManagementFile(item));


      this.files.forEach(person => {
        if (!this.groupedByCreateAt[person.createdAt]) {
          this.groupedByCreateAt[person.createdAt] = [];
        }
        this.groupedByCreateAt[person.createdAt].push(person);
      });
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
  onToggleFileInfo(data) {
    this.toggleFileInfo = data;
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
