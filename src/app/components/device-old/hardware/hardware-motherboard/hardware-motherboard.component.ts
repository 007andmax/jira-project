import { Component, Input, OnInit } from '@angular/core';
import { Bios, Motherboard } from '../class/system';
import { CONFIGCONSTANTS } from '../../config/app-constants';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'hardware-motherboard',
    templateUrl: './hardware-motherboard.component.html',
    styleUrls: ['./hardware-motherboard.component.scss'],
    standalone: true,
    imports: [DatePipe]
})
export class HardwareMotherboardComponent implements OnInit {
  @Input() motherBoard: Motherboard;
  @Input() bios: Bios;
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  constructor() { }

  ngOnInit() {
  }

}
