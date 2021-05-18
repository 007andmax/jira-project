import { Component, Input, OnInit } from '@angular/core';
import { CurrentUser } from 'src/class/current-user/current-user';
import { DocumentsCategory } from '../class/documents-category';
import * as moment from "moment";
import { Document } from '../class/document';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.css']
})
export class DocumentsTableComponent implements OnInit {
  @Input() item: Document;
  currentUser: CurrentUser;
  constructor(private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) {
      this.currentUser = this.usersStateService.getCurrentUser();

    }
  }

  isCategory() {
    return this.item.categoryId;
  }
  getCreateBy() {
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.item.createdBy)
    return `${user.firstName} ${user.lastName}`;
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
    return listCompanies.map(item => item.name).join(",");
  }

  /* getSharedWith() {
     if (this.item.list.length === 1 && this.item.list[0].createdBy.id === this.currentUser.id) return "Only you";
     if (this.item.list.length >= 1) return this.item.list.length;
     return "";
   }*/
}
