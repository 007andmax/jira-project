import { Component, OnInit, SimpleChanges } from '@angular/core';
import FroalaEditor from 'froala-editor';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DocumentsCategory } from './class/documents-category';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  showPreloader: boolean = true;
  list: Array<DocumentsCategory> = [];
  constructor(private usersStateService: UsersStateService,
    private documentsService: DocumentsService) {

  }

  ngOnInit() {
    this.documentsService.getList().subscribe(data => {
      for (var prop in data) this.list.push(new DocumentsCategory(prop, data[prop]));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
}
