import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrentUser } from 'src/class/current-user/current-user';
import * as moment from "moment";
import { Document } from '../class/document';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Router } from '@angular/router';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss']
})
export class DocumentsTableComponent implements OnInit {
  @Input() item: Document;
  @Input() companyId: string;
  @Output() onRemoveCategory = new EventEmitter<any>();
  @Output() onRemoveDocument = new EventEmitter<any>();
  @Output() onEditDocument = new EventEmitter<any>();
  showNotificationReview: boolean = false;
  currentUser: CurrentUser;
  constructor(private usersStateService: UsersStateService,
    public router: Router,
    private permissionsService: PermissionsService,
    public documentsStateService: DocumentsStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
  }
  ngDoCheck() {
    this.showNotificationReview = new Date(this.item.reviewDate).getTime() < new Date().getTime() && !this.item.isCategory;
  }
  navigateToCategory() {
    if (!this.item.isCategory) return;
    this.router.navigate(
      ['/documents/category/', this.item.categoryId]);
  }
  showTemplate() {
    if (!this.item.isCategory && this.getPermissions('VIEW_DOCUMENT')) this.documentsStateService.onInitGetTemplate(this.item);
  }
  getCreateBy() {
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.item.createdBy)
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  parseCreateAt() {
    return moment(new Date(this.item.createdAt)).format('DD MMM YYYY');
  }
  parseReviewAt() {
    return moment(new Date(this.item.reviewDate)).format('DD MMM YYYY');
  }
  getCompanies() {
    if (this.companiesStateService.getCompanies().length === 0) return '';
    let listCompanies = this.item.linked.companies.map(item => this.companiesStateService.getCompanies().find(company => company.id === item));
    return listCompanies.map(item => item.name).join(", ");
  }
  removeCategory() {
    this.onRemoveCategory.emit(this.item);
  }
  removeDocument() {
    this.onRemoveDocument.emit(this.item);
  }

  previewDocument() {
    const url = `/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/documents/preview/${this.item.id}`;
    window.open(url, '_blank');
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
