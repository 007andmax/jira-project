import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-company-devices-aside-tooltip',
  templateUrl: './company-devices-aside-tooltip.component.html',
  styleUrls: ['./company-devices-aside-tooltip.component.scss']
})
export class CompanyDevicesAsideTooltipComponent implements OnInit {
  @Input() initDropdownToggle: boolean = true;
  @Output() onClick = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  click() {
    this.onClick.emit(null);
  }
}
