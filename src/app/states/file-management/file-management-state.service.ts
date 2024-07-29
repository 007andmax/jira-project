import { EventEmitter, Injectable } from '@angular/core';
import { FileManagementCategory } from 'src/app/components/file-management/class/file-management-category';
import { FileManagementFile } from 'src/app/components/file-management/class/file-management-file';
import { ManageTag } from 'src/app/components/setting/manage-tags/class/manage-tag';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagementStateService {
  onShowAsideForAdd: EventEmitter<any> = new EventEmitter();
  categoryForRemove: FileManagementCategory;
  categoryForFile: FileManagementFile;
  constructor(private fileManagementService: FileManagementService) { }
  public showAsideForAdd() {
    this.onShowAsideForAdd.emit(null);
  }
  public setCategoryForRemove(data) {
    this.categoryForRemove = data;
  }
  public getCategoryForRemove() {
    return this.categoryForRemove;
  }
  public setFileForRemove(data) {
    this.categoryForFile = data;
  }
  public getFileForRemove() {
    return this.categoryForFile;
  }

}
