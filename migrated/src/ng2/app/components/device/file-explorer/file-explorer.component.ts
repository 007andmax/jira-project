import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileComponent implements OnInit {
  show = false;
  create = false;
  expand = false;
  options = {};
  uploadInput = false;
  files = false;
  editAddUser = false;
  assignExpand = false;
  addUser = false;

  constructor() { }

  ngOnInit() {
  }

}
