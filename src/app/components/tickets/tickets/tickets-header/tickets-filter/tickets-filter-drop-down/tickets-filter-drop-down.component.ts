import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CompanyTagsListService } from 'src/app/components/companies/company-tags/services/company-tags-list.service';

@Component({
  selector: 'tickets-filter-drop-down',
  templateUrl: './tickets-filter-drop-down.component.html',
  styleUrls: ['./tickets-filter-drop-down.component.scss'],
  providers: [CompanyTagsListService]
})
export class TicketsFilterDropDownComponent extends CompanyTagsComponent {
  @Input() placement: string = 'bottom-left';
  @Input() field: string = null;
  @Input() list: Array<any> = [];
  @Input() reducerItem: Function = (item) => (this.field) ? item[this.field] : item;
  @Input() placeholder = '';
  @Output() filterChange = new EventEmitter();
  @Input() selectedTag: Array<any> = [];
  reqList: Array<any> = [];
  public ngOnInit() {


  }
  ngDoCheck() {
    if (this.reqList.length === 0) this.reqList = JSON.parse(JSON.stringify(this.list));
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedTag.findIndex(item => (this.field) ? item[this.field] == newItem[this.field] : item == newItem);
    if (findIndex > -1) {
      this.selectedTag.splice(findIndex, 1);
    } else {
      this.selectedTag.push(newItem);
      this.list = JSON.parse(JSON.stringify(this.reqList));
    }
    this.filterChange.emit(this.selectedTag);
    this.userInput.nativeElement.value = '';

    if (this.searchName.length > 0) {
      this.searchName = "";
      this.setDefaultScoll();
      this.onScroll();
    }

  }
  public remove(index): void {
    if (index >= 0) {
      this.selectedTag.splice(index, 1);
      this.filterChange.emit(this.selectedTag);
      this.cd.detectChanges();
    }
  }
  onSearch(event) {
    this.list = this.reqList.filter(item => ((this.field) ? item[this.field] : item).toLowerCase().includes(event.target.value));
  }
  isSelected(data) {
    return this.selectedTag.find(item => (this.field) ? item[this.field] == data[this.field] : item == data);
  }
  reduceItemName(item) {
    return this.reducerItem(item);
  }
}

