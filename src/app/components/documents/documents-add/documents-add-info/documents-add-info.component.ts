import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents-add-info',
  templateUrl: './documents-add-info.component.html',
  styleUrls: ['./documents-add-info.component.scss']
})
export class DocumentsAddInfoComponent implements OnInit {
  toggleAside: boolean = true;
  toggleEditCategories: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
