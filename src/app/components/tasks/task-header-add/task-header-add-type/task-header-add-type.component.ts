import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-task-header-add-type',
    templateUrl: './task-header-add-type.component.html',
    styleUrls: ['./task-header-add-type.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgIf, NgbTooltipModule, NgClass, NgFor]
})
export class TaskHeaderAddTypeComponent {
  @Input() isDisabled: boolean = false;
  @Input() container: string = null;
  listTypes = [new CompanySetting('Meeting', 'Meeting'),
  new CompanySetting('To do', 'To do'),
  new CompanySetting('Phone call', 'Phone call')];
  @Input() selectedType: CompanySetting;
  @Output() onChange = new EventEmitter<any>();

  ngOnInit() {
    if (!this.selectedType) this.selectedType = new CompanySetting('To do', 'To do');
  }
  public initDefaultValue() {
    this.selectedType = new CompanySetting('To do', 'To do');
  }
  public clearWithOutChanges() {
    this.selectedType = null;
  }
  onSelect(item) {
    this.selectedType = item;
    this.onChange.emit(this.selectedType);
  }
  public isSelected(item) {
    return this.selectedType ? this.selectedType.value === item.value : false;
  }
}
