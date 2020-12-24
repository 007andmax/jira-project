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
  // @Input() name: string;
  showEdit: boolean = false;
  placeholder: string = '';
  @Output() onChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.value = JSON.parse(JSON.stringify(this.field));
  }
  public setValue(value) {
    this.value = JSON.parse(JSON.stringify(value));
  }
  ngDoCheck() {
    this.placeholder = (this.field !== '') ? this.field : `Enter ${this.title} here`;
  }
  onCheckValue() {
    console.log('this.value', this.value);
    console.log('this.field', this.field);
    if (this.value !== this.field) this.onChange.emit(this.value);

  }
  public onShowInput() {

    this.value = JSON.parse(JSON.stringify(this.field));
    console.log("this.value", this.value);
  }
}
