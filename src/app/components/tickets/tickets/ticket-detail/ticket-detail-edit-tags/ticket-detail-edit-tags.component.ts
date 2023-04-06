import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { TicketEditTagsComponent } from '../../ticket-edit-aside/ticket-edit-tags/ticket-edit-tags.component';

@Component({
  selector: 'ticket-detail-edit-tags',
  templateUrl: './ticket-detail-edit-tags.component.html',
  styleUrls: ['./ticket-detail-edit-tags.component.scss']
})
export class TicketDetailEditTagsComponent extends TicketEditTagsComponent {

  @Output() tagsRemove = new EventEmitter();
  public selected(tag): void {
    // this.init = true;
    let find = this.selectedTag.find(item => item.id === tag.id);
    if (!find) {
      this.selectedTag.push(tag);
      this.isChangeInput = false;
      this.tagsChange.emit(this.selectedTag);
    } else {
      this.isChangeInput = false;
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.closest('.selected-tag-ticket')) return;
    if (!event.target.closest('app-ticket-edit-tags') && !event.target.closest('.dropdown-menu') && (this.init || this.isChangeInput)) {
      if (this.isChangeInput) {
        if (this.userInput.nativeElement.value.trim() == "") {
          this.tagCtrl.setValue(null);
          return;
        }
        if (this.tags.find(item => item.word == this.userInput.nativeElement.value.trim())) {
          this.selected(this.tags.find(item => item.word == this.userInput.nativeElement.value.trim()));
          this.tagCtrl.setValue(null);
          this.tagsDp.close();
          return;
        }
        let tag: any = {
          colorCode: 0, usedCounter: 0, word: this.userInput.nativeElement.value.trim(), id: ''
        }
        this.tagsDp.close();
        let setTags = this.tagsService.addTicketsTags(tag).subscribe((res) => {
          tag.id = res.id;
          this.tags.push(tag);
          this.selectedTag.push(tag);
          this.userInput.nativeElement.value = '';
          this.tagCtrl.setValue(null);
          this.isChangeInput = false;
          this.init = false;
          this.tagsChange.emit(this.selectedTag);

        }, err => {
          this.isChangeInput = false;

        });
        this.sub.add(setTags);
      } else {
        this.isChangeInput = false;
        this.init = false;
        this.tagsChange.emit(this.selectedTag);
      }

    }
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
  onChangeDropDown(data) {
    if (!data) {
      this.tags = JSON.parse(JSON.stringify(this.reqTags));
      this.elRef.nativeElement.querySelector("#search-dropdown").value = "";
    }
  }
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.tagsRemove.emit(this.selectedTag);
    }
    //   this.init = true;
  }
}
