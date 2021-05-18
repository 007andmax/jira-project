import { Component, OnInit, SimpleChanges } from '@angular/core';
import FroalaEditor from 'froala-editor';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Document } from './class/document';
import { DocumentsCategory } from './class/documents-category';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  showPreloader: boolean = true;
  list: Array<Document> = [];
  constructor(private usersStateService: UsersStateService,
    private documentsService: DocumentsService) {

  }

  ngOnInit() {
    this.documentsService.getList().subscribe((data: any) => {
      data.categories.map(item => this.list.push(new Document({ categoryId: item.id, categoryName: item.name })));
      data.documents.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
  getNameDocument(item: Document) {
    if (item.categoryId) return item.categoryName;
    return item.title;

  }
}
