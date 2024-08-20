import { EventEmitter, Injectable } from '@angular/core';
import { FileManagerCategory } from 'src/app/components/file-manager/class/file-manager-category';
import { FileManagerFile } from 'src/app/components/file-manager/class/file-manager-file';
import { ManageTag } from 'src/app/components/setting/manage-tags/class/manage-tag';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { Tag } from 'src/app/interfaces/tag/tag';

@Injectable({
  providedIn: 'root'
})
export class FileManagementStateService {
  tags: Array<Tag> = [];
  onGetTags: EventEmitter<any> = new EventEmitter();
  onEditFile: EventEmitter<any> = new EventEmitter();
  onEditCategory: EventEmitter<any> = new EventEmitter();
  onAddFile: EventEmitter<any> = new EventEmitter();
  onRemoveFile: EventEmitter<any> = new EventEmitter();
  onRemoveCategory: EventEmitter<any> = new EventEmitter();
  onAddCategory: EventEmitter<any> = new EventEmitter();
  onShowAsideForAdd: EventEmitter<any> = new EventEmitter();
  categoryForRemove: FileManagerCategory;
  categoryForFile: FileManagerFile;
  constructor(private fileManagementService: FileManagementService) { }

  public getTags() {
    return this.tags;
  }
  /**
  * @description Set list tags
*/
  public editFile(data) {
    this.onEditFile.emit(data);
  }
  public editCategory(data) {
    this.onEditCategory.emit(data);
  }
  public removeCategory(data) {
    this.onRemoveCategory.emit(data);
  }
  public removeFile(data) {
    this.onRemoveFile.emit(data);
  }
  public addFile(data) {
    this.onAddFile.emit(data);
  }
  public addCategory(data) {
    this.onAddCategory.emit(data);
  }

  public setTags(data) {
    this.tags = data;
    this.onGetTags.emit(this.tags);
  }
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
