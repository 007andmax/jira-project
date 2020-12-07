import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-company-devices-edit-label',
  templateUrl: './company-devices-edit-label.component.html',
  styleUrls: ['./company-devices-edit-label.component.scss']
})
export class CompanyDevicesEditLabelComponent implements OnInit {
  value: string;
  @Input() field: string;
  @Input() title: string;
  @Input() name: string;
  placeholder: string = '';
  @Output() onChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  ngDoCheck() {
    this.placeholder = (this.field !== '') ? this.field : `Enter ${this.title} here`;
  }
  change() {
    this.onChange.emit(this.field);
  }
  public onOpenDropDown(open) {
    if (open) this.value = JSON.parse(JSON.stringify(this.field))
  }
  close() {
    this.value = '';
  }
}
