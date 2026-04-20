import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-manufactures-drop-down',
    templateUrl: './manufactures-drop-down.component.html',
    styleUrls: ['./manufactures-drop-down.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgClass, NgStyle, NgIf, NgFor]
})
export class ManufacturesDropDownComponent extends DropDownComponent {


  onKeyUp(event) {
    if (event.keyCode === 13) {
      const value = event.target.value;
      if ((value || '').trim()) {
        let search = this.list.find(item => item.name == value);
        if (search) {
          this.selectedItem = search;
          this.onSelectedItem.emit(this.selectedItem);

          this.list = this.reqList;
          this.ref.detectChanges();
          this.dp.close();
          return;
        }
        let tag: any = {
          "manufacturer": value.trim()
        }
        this.devicesService.addManufacture(tag).subscribe((res: any) => {
          let manufacturer = { id: res.manufacturerId, name: tag.manufacturer };
          this.reqList.push(manufacturer);
          this.list = this.reqList;
          this.selectedItem = manufacturer;
          this.onSelectedItem.emit(this.selectedItem);
          this.dp.close();
          this.ref.detectChanges();
        });
      }
    }
  }
}
