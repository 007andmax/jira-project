import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';

@Component({
  selector: 'gl-numbers-drop-down',
  templateUrl: './gl-numbers-drop-down.component.html',
  styleUrls: ['./gl-numbers-drop-down.component.scss']
})
export class GlNumbersDropDownComponent extends DropDownComponent {

  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => item["glNumber"].toLowerCase().includes(event.target.value.toLowerCase()) || item["description"].toLowerCase().includes(event.target.value.toLowerCase()))
    let index = this.list.findIndex(item => (this.field) ? item[this.field] === event.target.value : item === event.target.value);
    if (index === -1 && this.add) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }
  getSelectedItemText() {
    return (this.selectedItem) ? `${this.selectedItem["glNumber"]} - ${this.selectedItem["description"]}` : "";
  }
}
