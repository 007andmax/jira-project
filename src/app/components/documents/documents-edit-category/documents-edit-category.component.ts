import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentEditCategory } from './class/document-edit-category';

@Component({
  selector: 'documents-edit-category',
  templateUrl: './documents-edit-category.component.html',
  styleUrls: ['./documents-edit-category.component.scss']
})
export class DocumentsEditCategoryComponent implements OnInit {
  opened: boolean = false;
  documentEditCategory: DocumentEditCategory;
  companies: Array<Company> = [];
  reqCompanies: Array<Company> = [];
  selectedCompanies: Array<Company> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private documentsService: DocumentsService,
    private documentsStateService: DocumentsStateService) { }

  ngOnInit() {
    this.documentsStateService.onEditFolder.subscribe(data => {
      console.log("data", data);
      this.documentsService.getCategory(data.categoryId).subscribe(res => {
        this.documentEditCategory = new DocumentEditCategory(res);
        this.opened = true;
      })
    })
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  onSearch(event) {
    this.companies = this.reqCompanies.filter(item => item.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()));
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.reqCompanies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  onSelectCompany(event, company) {
    if (event.target.checked) {
      this.selectedCompanies.push(company);
      this.documentEditCategory.addAssignedCompaniesIds(company.id);
    } else {

      let index = this.selectedCompanies.findIndex(item => item.id === company.id);
      if (index > -1) this.selectedCompanies.splice(index, 1);
      let indexId = this.documentEditCategory.assignedCompaniesIds.find(item => item === company.id);
      if (indexId > -1) this.documentEditCategory.removedAssignedCompaniesIds(indexId);
    }
    // this.documentEditCategory.setAssignedCompaniesIds(this.selectedCompanies.map(item => item.id));
  }
  checkLogo(company) {
    return (company && company.logo && company.logo.cropped && company.logo.cropped.id || company && company.logo && company.logo.origin && company.logo.origin.id)
  }
  checkSelected(id) {
    return this.documentEditCategory.assignedCompaniesIds.find(item => item == id);
  }
  checkSelectedType(type) {
    return this.documentEditCategory.assignedCompanyTypes.find(item => item == type);
  }
  onChangedType(event, type) {
    if (event.target.checked) {
      this.documentEditCategory.addAssignedCompanyTypes(type);
      this.reqCompanies.filter(item => item.clientType === type && !this.documentEditCategory.assignedCompaniesIds.find(itemId => itemId === item.id)).forEach(item => {
        this.documentEditCategory.addAssignedCompaniesIds(item.id);
      });
    } else {
      let index = this.documentEditCategory.assignedCompanyTypes.findIndex(item => item === type);
      if (index > -1) this.documentEditCategory.removedAssignedCompanyTypes(index);
    }
  }
  getCompanyLogoUrl(company) {
    if (company && company.logo && company.logo && company.logo.base64 && !company.logo.cropped) return company.logo.base64;
    if (company && company.logo && company.logo.cropped && company.logo.cropped.id) return `/file/${company.logo.cropped.id}`;
    if (company && company.logo && company.logo.origin && company.logo.origin.id) return `/file/${company.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  onSave() {
    this.documentsService.editCategory(this.documentEditCategory.id, this.documentEditCategory.getDataForUpdate()).subscribe(data => {
      this.close();
    })
  }
  close() {
    this.opened = false;
  }
}
