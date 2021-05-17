import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { CategoryDocument } from './class/category-document';

@Component({
  selector: 'app-left-panel-documents',
  templateUrl: './left-panel-documents.component.html',
  styleUrls: ['./left-panel-documents.component.scss']
})
export class LeftPanelDocumentsComponent implements OnInit {

  @Output() onChangeState = new EventEmitter();
  @Input() activePage: string = "";
  categories: Array<CategoryDocument> = [];
  constructor(private documentsService: DocumentsService) { }

  ngOnInit() {
    this.documentsService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new CategoryDocument(item));
    })
  }

  public goToState() {
    this.onChangeState.emit('new-documents');
  }
}
