import { Component, Input, OnInit } from '@angular/core';
import { Adapter, System } from '../class/system';

@Component({
  selector: 'hardware-operating-system',
  templateUrl: './hardware-operating-system.component.html',
  styleUrls: ['./hardware-operating-system.component.scss']
})
export class HardwareOperatingSystemComponent implements OnInit {
  @Input() system: System;
  @Input() networkAdapters: Adapter;
  @Input() WindowsLicenseKey: string;
  constructor() { }

  ngOnInit() {
  }

}
