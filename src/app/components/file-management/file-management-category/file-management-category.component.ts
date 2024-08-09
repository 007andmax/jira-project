import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';

@Component({
  selector: 'app-file-management-category',
  templateUrl: './file-management-category.component.html',
  styleUrls: ['./file-management-category.component.scss']
})
export class FileManagementCategoryComponent implements OnInit {
  showPreloader: boolean = true;
  categoryId: string;
  categories: Array<FileManagementCategory> = [];
  files: Array<FileManagementFile> = [];
  sub: Subscription = new Subscription();
  constructor(private fileManagementService: FileManagementService,
    private activateRoute: ActivatedRoute,
    private leftPanelStateService: LeftPanelStateService,
    public fileManagementRealTimeService: FileManagementRealTimeService,
    public cd: ChangeDetectorRef,
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
      }

      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
  }
  getList() {
    this.fileManagementService.getFileManagement(this.categoryId).subscribe((data: any) => {
      this.categories = data.categories.map(item => new FileManagementCategory(item));
      this.files = data.files.map(item => new FileManagementCategory(item));
      this.showPreloader = false;
    })
  }
}
