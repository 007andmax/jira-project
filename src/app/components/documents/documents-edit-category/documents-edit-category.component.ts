import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { Company } from 'src/app/interfaces/company/company';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { DocumentEditCategory } from './class/document-edit-category';

@Component({
  selector: 'documents-edit-category',
  templateUrl: './documents-edit-category.component.html',
  styleUrls: ['./documents-edit-category.component.scss'],

})
export class DocumentsEditCategoryComponent implements OnInit, OnDestroy {
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  opened: boolean = false;
  documentEditCategory: DocumentEditCategory;
  companies: Array<Company> = [];
  reqCompanies: Array<Company> = [];
  selectedCompanies: Array<Company> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private documentsService: DocumentsService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private documentsStateService: DocumentsStateService) { }


  ngOnInit() {
    let onEditFolder = this.documentsStateService.onEditFolder.subscribe(data => {
      this.documentsService.getCategory(data.categoryId).subscribe(res => {
        this.documentEditCategory = new DocumentEditCategory(res);
        this.opened = true;
      })
    })
    this.sub.add(onEditFolder);
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

  checkLogo(company) {
    return (company && company.logo && company.logo.cropped && company.logo.cropped.id || company && company.logo && company.logo.origin && company.logo.origin.id)
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
      if (index > -1) {
        this.documentEditCategory.removedAssignedCompanyTypes(index);
        this.reqCompanies.filter(item => item.clientType === type).forEach(item => {
          let index = this.documentEditCategory.assignedCompaniesIds.findIndex(companyId => companyId == item.id)
          this.documentEditCategory.removedAssignedCompaniesIds(index);
        });
      }
    }
  }
  getCompanyLogoUrl(company) {
    if (company && company.logo && company.logo && company.logo.base64 && !company.logo.cropped) return company.logo.base64;
    if (company && company.logo && company.logo.cropped && company.logo.cropped.id) return `/file/${company.logo.cropped.id}`;
    if (company && company.logo && company.logo.origin && company.logo.origin.id) return `/file/${company.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  onSave() {
    this.addBtn.setDisabled(true);
    this.documentsService.editCategory(this.documentEditCategory.id, this.documentEditCategory.getDataForUpdate()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.toastrService.success("The category has been successfully updated");
      this.appStateService.changeDetectorRef();
      this.close();
    })
  }
  close() {
    this.opened = false;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
