import { Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { ManufactureDevice } from '../class/manufacture-device';

@Component({
  selector: 'app-models-drop-down',
  templateUrl: './models-drop-down.component.html',
  styleUrls: ['./models-drop-down.component.scss']
})
export class ModelsDropDownComponent extends DropDownComponent {
  @Input() manufactureId: string;

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
        let model: any = {
          "model": value.trim(),
          manufacturerId: this.manufactureId
        }
        this.devicesService.addModel(model).subscribe((res: any) => {
          let model = new ManufactureDevice({ id: res.modelId, name: value.trim() });
          this.reqList.push(model);
          this.list = this.reqList;
          this.selectedItem = model;
          this.onSelectedItem.emit(this.selectedItem);
          this.dp.close();
          this.ref.detectChanges();
        });
      }
    }
  }
}
