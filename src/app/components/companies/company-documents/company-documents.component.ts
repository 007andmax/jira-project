import { Component, OnInit, ViewChild } from '@angular/core';
import { REMOVE_CATEGORY_DOCUMENT, REMOVE_DOCUMENT } from 'src/app/const/confirm';
import { Document } from '../../documents/class/document';
import { DocumentsHeaderComponent } from '../../documents/documents-header/documents-header.component';
import { DocumentsComponent } from '../../documents/documents.component';

@Component({
  selector: 'company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.scss']
})
export class CompanyDocumentsComponent extends DocumentsComponent {
  companyId: string;
  @ViewChild('header') header: DocumentsHeaderComponent;

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      console.log("id", this.companyId);
      this.filter.setCompanyId(this.companyId);
      this.getFilterList();

      let company = this.companiesStateService.getCompanies().find(item => item.id === this.companyId);
      this.header.filter.companyDp.isDisabled = true;
      this.header.filter.companyDp.editItem = company;
      this.header.filter.documentsFilter.setCompanyId(this.companyId);
      this.header.filter.onChangeCounterFilter();
    });
    this.sub.add(subscription);
    this.leftPanelStateService.changeStateWithoutNavigate('company-documents');

    this.documentsStateService.onGetCategories.subscribe(data => {
      data.forEach(element => {
        let findIndex = this.list.findIndex(item => item.categoryId === element.id);
        if (findIndex > -1) this.list[findIndex].categoryName = element.name;
        if (findIndex > -1) console.log("this.list[findIndex]", this.list[findIndex]);
      });
      this.cd.detectChanges();
    })
    let onChangeDocument = this.documentsStateService.onChangeDocument.subscribe(data => {
      console.log("data", data);
      if (data.action === "DOCUMENT_SAVED" && !data.data.categoryId) this.list.push(new Document(data.data));
      if (data.action === "DOCUMENT_EDITED") {
        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        if (findIndex > -1 && !data.data.categoryId) this.list[findIndex] = new Document(data.data);
        if (findIndex > -1 && data.data.categoryId) this.list.splice(findIndex, 1);
        console.log("findIndex", findIndex);
      }

      if (data.action === "DOCUMENT_REMOVED") {
        let findIndex = this.list.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.list.splice(findIndex, 1);
        console.log("findIndex", findIndex);
      }
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
    let filter = this.documentsStateService.filter.subscribe(data => {
      this.showPreloader = true;
      this.filter.setFilters(data);
      this.getFilterList();
    })
    this.sub.add(filter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_DOCUMENT) this.removeCategory(this.documentsStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());

      }
    })
    this.sub.add(getConfirm);

  }
}
