import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'documents-add-edit-categories',
  templateUrl: './documents-add-edit-categories.component.html',
  styleUrls: ['./documents-add-edit-categories.component.scss']
})
export class DocumentsAddEditCategoriesComponent implements OnInit {
  @Output() onClosed = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.onClosed.emit(null);
  }
}
