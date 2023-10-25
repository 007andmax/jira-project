import { Component, Input, OnInit } from '@angular/core';
import { Memory } from '../class/system';

@Component({
  selector: 'hardware-memory',
  templateUrl: './hardware-memory.component.html',
  styleUrls: ['./hardware-memory.component.scss']
})
export class HardwareMemoryComponent implements OnInit {
  @Input() memory: Array<Memory> = [];
  constructor() { }

  ngOnInit() {
  }

}
