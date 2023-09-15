import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'tickets-filter-companies-drop-down',
  templateUrl: './tickets-filter-companies-drop-down.component.html',
  styleUrls: ['./tickets-filter-companies-drop-down.component.scss']
})
export class TicketsFilterCompaniesDropDownComponent extends CompanyDropDownComponent {
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedItems: Array<any> = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchName: string = "";
  @Input() placement: string = 'bottom-left';
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @Output() filterChange = new EventEmitter<any>();
  public remove(index): void {
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this.filterChange.emit(this.selectedItems);
    }
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedItems.findIndex(item => (this.field) ? item[this.field] == newItem[this.field] : item == newItem);
    if (findIndex > -1) {
      this.selectedItems.splice(findIndex, 1);
    } else {
      this.selectedItems.push(newItem);
      this.list = JSON.parse(JSON.stringify(this.reqList));
    }
    this.filterChange.emit(this.selectedItems);
    this.userInput.nativeElement.value = '';

    if (this.searchName.length > 0) {
      this.searchName = "";
    }
  }
  public clearWithOutChanges() {
    this.isAdd = false;
    this.selectedItem = null;
    this.selectedItems = [];
  }
  onSearch(event) {
    this.list = this.reqList.filter(item => ((this.field) ? item[this.field] : item).toLowerCase().includes(event.target.value));
  }
  isSelected(data) {
    return this.selectedItems.find(item => (this.field) ? item[this.field] == data[this.field] : item == data);
  }
}
