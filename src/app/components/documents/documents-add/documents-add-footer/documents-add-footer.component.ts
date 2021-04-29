import { Component, Input, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentAdd } from '../class/document-add';

@Component({
  selector: 'app-documents-add-footer',
  templateUrl: './documents-add-footer.component.html',
  styleUrls: ['./documents-add-footer.component.scss']
})
export class DocumentsAddFooterComponent implements OnInit {
  @Input() documentAdd: DocumentAdd = new DocumentAdd();
  constructor(private documentsService: DocumentsService) { }

  ngOnInit() {
  }
  add() {
    console.log("documentAdd", this.documentAdd);
    this.documentsService.add(this.documentAdd).subscribe(data => {

    })
  }
}
