import { Component, Input, OnInit } from '@angular/core';
import { Bios, Motherboard } from '../class/system';
import { CONFIGCONSTANTS } from '../../config/app-constants';

@Component({
  selector: 'hardware-motherboard',
  templateUrl: './hardware-motherboard.component.html',
  styleUrls: ['./hardware-motherboard.component.scss']
})
export class HardwareMotherboardComponent implements OnInit {
  @Input() motherBoard: Motherboard;
  @Input() bios: Bios;
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  constructor() { }

  ngOnInit() {
  }

}
