import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { Document } from '../../class/document';

@Component({
  selector: 'documents-templates-item',
  templateUrl: './documents-templates-item.component.html',
  styleUrls: ['./documents-templates-item.component.scss']
})
export class DocumentsTemplatesItemComponent implements OnInit {
  @Input() item: Document;
  constructor(private documentsStateService: DocumentsStateService,
    private router: Router,) { }

  ngOnInit() {
  }
  showTemplate(item) {
    console.log("item", item);
    if (item) this.documentsStateService.onInitGetTemplate(item);
  }
  editDocument(item, event) {
    event.stopPropagation();
    this.router.navigate(
      ['/ng2/documents/edit/', item.id]);
  }
}
