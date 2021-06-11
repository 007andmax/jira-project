import { Component, Input, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { Document } from '../../class/document';
import { DocumentHistory } from '../../class/document-history';
import * as moment from "moment";
import { UsersStateService } from 'src/app/states/users/users-state.service';
@Component({
  selector: 'documents-edit-history',
  templateUrl: './documents-edit-history.component.html',
  styleUrls: ['./documents-edit-history.component.scss']
})
export class DocumentsEditHistoryComponent implements OnInit {
  @Input() documentEdit: Document;
  list: Array<DocumentHistory> = []
  constructor(private documentsService: DocumentsService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.documentsService.getHistory(this.documentEdit.id).subscribe((data: any) => {
      console.log("data", data);
      this.list = data.map(item => new DocumentHistory(item));
    })
  }
  getUserById(userId) {
    return this.usersStateService.getAllUsers().find(item => item.id === userId);
  }
  getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '#7c77bc';

    if (user.id) {
      return `#7c77bc url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `#7c77bc url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return '#7c77bc url(/users/default/image.jpg) 0% 0% / cover no-repeat';
    }
  };
  getNameForAvatar(user) {
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  parseDate(item) {
    return `${item.historyType === "OPEN" ? 'Opened' : 'Edited'} on ${moment(item.actionDate).format('DD MMM YYYY')}`
  }

}
