import { Component, OnInit } from '@angular/core';
import { TicketEditTagsComponent } from '../../ticket-edit-aside/ticket-edit-tags/ticket-edit-tags.component';

@Component({
  selector: 'ticket-detail-edit-tags',
  templateUrl: './ticket-detail-edit-tags.component.html',
  styleUrls: ['./ticket-detail-edit-tags.component.scss']
})
export class TicketDetailEditTagsComponent extends TicketEditTagsComponent {


  public selected(tag): void {
    // this.init = true;
    let find = this.selectedTag.find(item => item.id === tag.id);
    if (!find) {
      this.selectedTag.push(tag);
    }
    this.isChangeInput = false;
    this.tagsChange.emit(this.selectedTag);
  }

}
