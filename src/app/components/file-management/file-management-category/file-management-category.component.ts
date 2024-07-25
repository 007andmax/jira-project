import { Component, Input, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

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
  }
  getList() {
    this.fileManagementService.getFileManagement(this.categoryId).subscribe((data: any) => {
      this.categories = data.categories.map(item => new FileManagementCategory(item));
      this.files = data.files.map(item => new FileManagementCategory(item));
      this.showPreloader = false;
    })
  }
}
