import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';

@Component({
  selector: 'documents-filter-tags',
  templateUrl: './documents-filter-tags.component.html',
  styleUrls: ['./documents-filter-tags.component.scss']
})
export class DocumentsFilterTagsComponent implements OnInit, OnDestroy {
  public showSelect = false;
  selected: Array<Tag> = [];
  tags: Array<Tag> = [];
  @Input() editItems: Array<string>;
  @Output() onSelectedItems = new EventEmitter<any>();
  sub = new Subscription();
  constructor(public cd: ChangeDetectorRef,
    private tagsStateService: TagsStateService,
    private companiesStateService: CompaniesStateService,
    private tagsService: TagsService) { }

  ngOnInit() {
    this.tags = this.tagsStateService.getTags();
    this.setEditItems();
    let getTags = this.tagsStateService.onGetTags.subscribe((data: Array<Tag>) => {
      console.log("data", data);
      this.tags = data;
      this.setEditItems();
    })
    this.sub.add(getTags);
  }
  getCompanyName(tag) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === tag.companyId);
    return (company) ? company.name : '';
  }
  public hideSelectWrapper() {
    this.showSelect = false;
  }
  public setEditItems() {
    if (this.editItems) this.editItems.forEach(item => {
      this.selected.push(this.tags.find(tag => tag.id === item));
    })

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
