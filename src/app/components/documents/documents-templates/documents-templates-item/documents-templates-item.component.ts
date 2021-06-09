import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { Document } from '../../class/document';

@Component({
  selector: 'documents-templates-item',
  templateUrl: './documents-templates-item.component.html',
  styleUrls: ['./documents-templates-item.component.scss']
})
export class DocumentsTemplatesItemComponent implements OnInit {
  @Input() item: Document;
  @Output() onRemoveDocument = new EventEmitter<any>();
  categories: Array<CategoryDocument> = [];
  constructor(private documentsStateService: DocumentsStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,
    private router: Router,) { }

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      console.log("this.categories", this.categories);
      this.cd.detectChanges();
    })
  }
  getCategoryName() {
    let find = this.categories.find(item => item.id === this.item.categoryId);
    return (find) ? find.name : '';
  }
  showTemplate(item) {
    console.log("item", item);
    if (item) this.documentsStateService.onInitGetTemplate(item);
  }
  removeDocument() {
    this.onRemoveDocument.emit(this.item);
  }
  editDocument(item) {

    this.router.navigate(
      ['/ng2/documents/edit/', item.id]);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
