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
  onKeyUp(event) {

    if (event.keyCode === 13) {
      const input = event.target.input;
      const value = event.target.value;

      if ((value || '').trim()) {
        if (this.tags.find(item => item.word == value)) {
          this.selected(this.tags.find(item => item.word == value));
          if (input) {
            input.value = '';
          }
          this.tagCtrl.setValue(null);
          this.tagsDp.close();
          return;
        }
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: value.trim(), id: ''
        }
        this.tagsDp.close();
        let setTags = this.tagsService.addTicketsTags(tag).subscribe((res) => {
          this.isChangeInput = false;
          //  this.init = true;
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          if (input) {
            input.value = '';
          }
          this.tagCtrl.setValue(null);
          this.tagsChange.emit(this.selectedTag);
        }, err => {
          this.isChangeInput = false;
        });
        this.sub.add(setTags);
      }

    }

  }

}
