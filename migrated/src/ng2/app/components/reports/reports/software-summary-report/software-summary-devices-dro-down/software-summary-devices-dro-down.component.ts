import { Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/ng2/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'software-summary-devices-dro-down',
  templateUrl: './software-summary-devices-dro-down.component.html',
  styleUrls: ['./software-summary-devices-dro-down.component.css']
})
export class SoftwareSummaryDevicesDroDownComponent extends DropDownComponent {

  @Input() reducerItem: Function = (item) => item.hostName || item.ip;

  ngDoCheck() {
    if (this.sort) this.list.sort((a, b) => (a.hostName || a.ip).localeCompare(b.hostName || b.ip));
    if (this.reqList.length === 0) this.reqList = JSON.parse(JSON.stringify(this.list));
    if (this.editItem) this.selectedItem = (this.field) ? this.editItem : this.editItem;
  }
  getSelectedItemText() {
    return (this.selectedItem) ? this.selectedItem.hostName || this.selectedItem.ip : "";
  }
  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => (item.hostName || item.ip).toLowerCase().includes(event.target.value.toLowerCase()))
    let index = this.list.findIndex(item => (item.hostName || item.ip) === event.target.value);
    if (index === -1 && this.add) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }
}
