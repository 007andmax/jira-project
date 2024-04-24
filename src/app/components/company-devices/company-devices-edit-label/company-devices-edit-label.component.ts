import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-company-devices-edit-label',
  templateUrl: './company-devices-edit-label.component.html',
  styleUrls: ['./company-devices-edit-label.component.scss']
})
export class CompanyDevicesEditLabelComponent implements OnInit {
  value: string;
  @Input() field: string;
  @Input() isDisabled: boolean = false;
  showEdit: boolean = false;
  @Input() placeholder: string = '';
  @Output() onChange = new EventEmitter();
  isInitEdit: boolean = false;
  constructor() { }

  ngOnInit() {
    console.log("placeholder", this.placeholder);
    this.value = JSON.parse(JSON.stringify(this.field));
  }
  public setIsInitEdit(data) {
    this.isInitEdit = data;
  }
  public setValue(value) {
    this.value = JSON.parse(JSON.stringify(value));
  }
  onCheckValue() {
    if (this.value !== this.field) {
      this.onChange.emit(this.value);
      this.setIsInitEdit(false);
    }
  }
  public onUpdate() {
    this.value = JSON.parse(JSON.stringify(this.field));
  }
}
