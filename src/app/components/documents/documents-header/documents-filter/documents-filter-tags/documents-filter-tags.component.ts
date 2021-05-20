import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';

@Component({
  selector: 'documents-filter-tags',
  templateUrl: './documents-filter-tags.component.html',
  styleUrls: ['./documents-filter-tags.component.scss']
})
export class DocumentsFilterTagsComponent implements OnInit, OnDestroy {
  public showSelect = false;
  selected: Array<Tag> = [];
  tags: Array<Tag> = [];
  @Output() onSelectedItems = new EventEmitter<any>();
  sub = new Subscription();
  constructor(public cd: ChangeDetectorRef,
    private tagsService: TagsService) { }

  ngOnInit() {
    let getTags = this.tagsService.geCompanytTags().subscribe((data) => {
      this.tags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    })
    this.sub.add(getTags);
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
    this.onSelectedItems.emit(this.selected.map(item => item.id));
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
    this.onSelectedItems.emit(this.selected.map(item => item.id));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
