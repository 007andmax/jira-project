import { EventEmitter, Injectable } from '@angular/core';
import { ManageTag } from 'src/app/components/setting/manage-tags/class/manage-tag';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagementStateService {
  onShowAsideForAdd: EventEmitter<any> = new EventEmitter();

  constructor(private fileManagementService: FileManagementService) { }
  public showAsideForAdd() {
    this.onShowAsideForAdd.emit(null);
  }

}
