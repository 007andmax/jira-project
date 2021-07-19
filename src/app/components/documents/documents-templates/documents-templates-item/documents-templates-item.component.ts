import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
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
  companyTypes = [new TitleListType('All companies', 'ALL'), new TitleListType('Client', 'CLIENT'), new TitleListType('Lead', 'LEAD'), new TitleListType('Vendor', 'VENDOR')];

  constructor(private documentsStateService: DocumentsStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,
    private router: Router,) { }

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }
  getCompanyType() {
    let find = this.companyTypes.find(item => item.type === this.item.clientType);
    return (find) ? find.title : '';
  }
  getCategoryName() {
    let find = this.categories.find(item => item.id === this.item.categoryId);
    return (find) ? find.name : '';
  }
  showTemplate(item) {
    if (item) this.documentsStateService.onInitGetTemplate(item);
  }
  removeDocument() {
    this.onRemoveDocument.emit(this.item);
  }
  editDocument(item) {
    this.router.navigate(
      ['/documents/edit/', item.id]);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  exportPdf() {
    const url = `/documents/export?id=${this.item.id}`;
    window.open(url, '_blank');
  }
  printPdf() {
    const url = `/documents/show/${this.item.id}/pdf`;
    let open = window.open(url, '_blank');
    open.print();
  }
}
