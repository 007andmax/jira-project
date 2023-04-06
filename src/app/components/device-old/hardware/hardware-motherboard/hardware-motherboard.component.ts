import { Component, Input, OnInit } from '@angular/core';
import { Bios, Motherboard } from '../class/system';

@Component({
  selector: 'hardware-motherboard',
  templateUrl: './hardware-motherboard.component.html',
  styleUrls: ['./hardware-motherboard.component.scss']
})
export class HardwareMotherboardComponent implements OnInit {
  @Input() motherBoard: Motherboard;
  @Input() bios: Bios;
  constructor() { }

  ngOnInit() {
  }

}
