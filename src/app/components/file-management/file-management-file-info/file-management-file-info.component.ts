import { Component, Input, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';

@Component({
  selector: 'app-file-management-file-info',
  templateUrl: './file-management-file-info.component.html',
  styleUrls: ['./file-management-file-info.component.scss']
})
export class FileManagementFileInfoComponent implements OnInit {
  @Input() file: FileManagementFile;
  @Input() category: FileManagementCategory;
  constructor() { }

  ngOnInit() {
  }

}
