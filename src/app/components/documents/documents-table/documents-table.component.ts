import { Component, Input, OnInit } from '@angular/core';
import { CurrentUser } from 'src/class/current-user/current-user';
import { DocumentsCategory } from '../class/documents-category';
import * as moment from "moment";
import { Document } from '../class/document';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.css']
})
export class DocumentsTableComponent implements OnInit {
  @Input() item: DocumentsCategory;
  currentUser: CurrentUser;
  constructor(private usersStateService: UsersStateService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) {
      this.currentUser = this.usersStateService.getCurrentUser();

    }
  }
  getCreateBy(createdBy: CurrentUser) {
    return `${createdBy.firstName} ${createdBy.lastName}`;
  }
  getCreateByForCategory(list: Array<Document>) {
    let list_updatedAt = list.map(item => item.updatedAt);
    let updateAt = Math.max.apply(null, list_updatedAt);
    let find = list.find(item => item.updatedAt === updateAt);
    return this.getCreateBy(find.createdBy);
  }
  parseUpdateAtForCategory(list: Array<Document>) {
    let list_updatedAt = list.map(item => item.updatedAt);
    return moment(new Date(Math.max.apply(null, list_updatedAt))).format('DD MMM YYYY');
  }
  parseUpdateAt(updatedAt) {
    return moment(new Date(updatedAt)).format('DD MMM YYYY');
  }
  getSharedWith() {
    if (this.item.list.length === 1 && this.item.list[0].createdBy.id === this.currentUser.id) return "Only you";
    if (this.item.list.length >= 1) return this.item.list.length;
    return "";
  }
}
