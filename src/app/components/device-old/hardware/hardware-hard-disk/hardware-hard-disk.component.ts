import { Component, Input, OnInit } from '@angular/core';
import { LogicalDisk } from '../class/system';

@Component({
  selector: 'hardware-hard-disk',
  templateUrl: './hardware-hard-disk.component.html',
  styleUrls: ['./hardware-hard-disk.component.scss']
})
export class HardwareHardDiskComponent implements OnInit {
  @Input() logicalDisks: LogicalDisk;
  constructor() { }

  ngOnInit() {
  }
  parseDB(data) {
    return (data / 1024 / 1024 / 1024).toFixed(1)
  }
}
