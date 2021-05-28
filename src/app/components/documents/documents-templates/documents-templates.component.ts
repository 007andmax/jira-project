import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';

@Component({
  selector: 'documents-templates',
  templateUrl: './documents-templates.component.html',
  styleUrls: ['./documents-templates.component.scss']
})
export class DocumentsTemplatesComponent implements OnInit {
  openCategories: boolean = false;
  tab = 'TEMPLATE_GALLERY';
  constructor(private documentsService: DocumentsService,
    private documentsStateService: DocumentsStateService) { }

  ngOnInit() {
    this.getListCategories();
  }
  getListCategories() {
    this.documentsService.getTemplateCategories((this.tab === 'TEMPLATE_GALLERY')).subscribe(data => {
      console.log("data", data);
      this.documentsStateService.setCategoriesTemplate(data);
    })
  }
  onChangeTemplate(data) {
    this.tab = data;
    this.getListCategories();
  }
  toggleOpenCategories() {

    this.openCategories = !this.openCategories;
    console.log("toggleOpenCategories", this.openCategories)
  }
}
