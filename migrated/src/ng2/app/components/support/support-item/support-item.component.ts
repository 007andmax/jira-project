import { Component, Input, OnInit } from '@angular/core';
import { RemoteSession } from '../class/remote-sessions';

@Component({
  selector: 'app-support-item',
  templateUrl: './support-item.component.html',
  styleUrls: ['./support-item.component.scss']
})
export class SupportItemComponent implements OnInit {
  @Input() item: RemoteSession;
  constructor() { }

  ngOnInit() {
  }
  getUserName() {
    if (this.item.status === 'DOWNLOADED' || this.item.status === 'INSTALLED') return this.item.userName;
    return 'N/A';
  }
}
