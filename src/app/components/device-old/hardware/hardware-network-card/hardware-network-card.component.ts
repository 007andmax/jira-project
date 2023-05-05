import { Component, Input, OnInit } from '@angular/core';
import { Adapter } from '../class/system';

@Component({
  selector: 'hardware-network-card',
  templateUrl: './hardware-network-card.component.html',
  styleUrls: ['./hardware-network-card.component.scss']
})
export class HardwareNetworkCardComponent implements OnInit {
  @Input() networkAdapters: Adapter;
  @Input() externalIp: string = '';
  @Input() formatMacAddress: Function;
  constructor() { }

  ngOnInit() {
  }

}
