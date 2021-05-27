import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'documents-templates',
  templateUrl: './documents-templates.component.html',
  styleUrls: ['./documents-templates.component.scss']
})
export class DocumentsTemplatesComponent implements OnInit {
  openCategories: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  toggleOpenCategories() {

    this.openCategories = !this.openCategories;
    console.log("toggleOpenCategories", this.openCategories)
  }
}
