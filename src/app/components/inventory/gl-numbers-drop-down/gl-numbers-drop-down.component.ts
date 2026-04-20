import { Component } from '@angular/core';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { MatErrorComponent } from '../../shared/mat-error/mat-error.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'gl-numbers-drop-down',
    templateUrl: './gl-numbers-drop-down.component.html',
    styleUrls: ['./gl-numbers-drop-down.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgClass, NgStyle, NgIf, MatErrorComponent, NgFor]
})
export class GlNumbersDropDownComponent extends DropDownComponent {

  onCheckAdd(event) {
    if (this.search) this.list = this.reqList.filter(item => item["glNumber"].toLowerCase().includes(event.target.value.toLowerCase()) || item["description"] && item["description"].toLowerCase().includes(event.target.value.toLowerCase()))
    let index = this.list.findIndex(item => (this.field) ? item[this.field] === event.target.value : item === event.target.value);
    if (index === -1 && this.add) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }
  getSelectedItemText() {
    return (this.selectedItem) ? `${this.selectedItem["glNumber"]} - ${(this.selectedItem["description"]) ? this.selectedItem["description"] : "No description"}` : "";
  }
}
