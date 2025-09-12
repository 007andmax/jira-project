import { Component, EventEmitter, Output } from '@angular/core';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';

@Component({
  selector: 'app-task-header-add-type',
  templateUrl: './task-header-add-type.component.html',
  styleUrls: ['./task-header-add-type.component.scss']
})
export class TaskHeaderAddTypeComponent {
  listTypes = [new CompanySetting('Meeting', 'Meeting'),
  new CompanySetting('To do', 'To do'),
  new CompanySetting('Phone call', 'Phone call')];
  selectedType: CompanySetting;
  @Output() onChange = new EventEmitter<any>();

  onSelect(item) {
    this.selectedType = item;
    this.onChange.emit(this.selectedType);
  }
  public isSelected(item) {
    return this.selectedType ? this.selectedType.value === item.value : false;
  }
}
