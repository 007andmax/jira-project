import { Component, OnInit } from '@angular/core';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementCategory } from './class/file-management-category';
import { FileManagementFile } from './class/file-management-file';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent implements OnInit {
  showPreloader: boolean = true;
  categories: Array<FileManagementCategory> = [];
  files: Array<FileManagementFile> = [];
  constructor(private fileManagementService: FileManagementService) { }

  ngOnInit() {
    this.fileManagementService.getFileManagement().subscribe((data: any) => {
      this.categories = data.categories.map(item => new FileManagementCategory(item));
      this.files = data.files.map(item => new FileManagementCategory(item));
      this.showPreloader = false;
    })
  }

}
