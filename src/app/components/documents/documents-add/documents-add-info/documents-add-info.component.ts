import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-documents-add-info',
  templateUrl: './documents-add-info.component.html',
  styleUrls: ['./documents-add-info.component.scss']
})
export class DocumentsAddInfoComponent implements OnInit {
  openAside: boolean = true;
  toggleEditCategories: boolean = false;
  tab: string = 'DOCUMENT_INFO';
  @Output() onToggleAside = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  public toggleAside() {
    this.openAside = !this.openAside;
    this.onToggleAside.emit(this.openAside);
  }
  onChangeLinked(data) {

  }
}
