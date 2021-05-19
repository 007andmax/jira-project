import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'documents-filter-tags',
  templateUrl: './documents-filter-tags.component.html',
  styleUrls: ['./documents-filter-tags.component.scss']
})
export class DocumentsFilterTagsComponent implements OnInit {
  public showSelect = false;
  selected: Array<any> = [];
  constructor(public cd: ChangeDetectorRef,) { }

  ngOnInit() {
  }
  public hideSelectWrapper() {
    this.showSelect = false;

  }
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
    this.cd.detectChanges();
  }
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  removeItem(index) {
    this.selected.splice(index, 1);
  }
  isSeleted(item) {
    return this.selected.find(element => element.id === item.id);
  }
  public toggleItem(newItem) {
    let findIndex = this.selected.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selected.splice(findIndex, 1);
    } else {
      this.selected.push(newItem);
    }

  }
}
