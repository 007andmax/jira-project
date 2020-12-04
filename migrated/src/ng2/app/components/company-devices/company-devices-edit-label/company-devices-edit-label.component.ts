import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-edit-label',
  templateUrl: './company-devices-edit-label.component.html',
  styleUrls: ['./company-devices-edit-label.component.scss']
})
export class CompanyDevicesEditLabelComponent implements OnInit {
  value: string;
  @Input() field: string;
  @Input() title: string;
  @Input() placeholder: string = 'Enter a new device name here';
  @Output() onChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  change() {
    this.onChange.emit(this.field);
  }
  public onOpenDropDown(open) {
    console.log("open", open);
    if (open) this.value = JSON.parse(JSON.stringify(this.field))
  }
  close() {
    this.value = '';
  }
}
