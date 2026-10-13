import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { Document } from '../../class/document';
import { DocumentHistory } from '../../class/document-history';
import * as moment from "moment";
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketsTableItemRequestedByComponent } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';
@Component({
  standalone: true,
  imports: [CommonModule, NgbModule, UserLogoPopoverDirective, TicketsTableItemRequestedByComponent],
  selector: 'documents-edit-history',
  templateUrl: './documents-edit-history.component.html',
  styleUrls: ['./documents-edit-history.component.scss'],
  providers: [TicketsListService]
})
export class DocumentsEditHistoryComponent implements OnInit {
  @Input() documentEdit: Document;
  showLoadMore: boolean = false;
  showPreloader: boolean = true;
  showMiniPreloader: boolean = false;
  list: Array<DocumentHistory> = []
  page: number = 0;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(private documentsService: DocumentsService,
    public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    this.getHistory();
  }
  getHistory() {
    this.showMiniPreloader = true;
    this.documentsService.getHistory(this.documentEdit.id, this.page).subscribe((data: any) => {
      this.list = [...this.list, ...data.documentHistoryDtoSet.map(item => new DocumentHistory(item))];
      this.showLoadMore = (this.list.length < data.totalElements);
      this.page++;
      this.showPreloader = false;
      this.showMiniPreloader = false;
    })
  }
  getUserById(userId) {
    return this.usersStateService.getAllUsers().find(item => item.id === userId);
  }
  getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '#7c77bc';
    if (user.id) {
      return `#7c77bc url(/users/${user.id}/image${(user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `#7c77bc url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    }
  };
  parseDate(item) {
    return `${item.historyType === "OPEN" ? 'Opened' : 'Edited'} on ${moment(item.actionDate).format('DD MMM YYYY')}`
  }
  public trackById(index, item) {
    return item.id;
  }
}
