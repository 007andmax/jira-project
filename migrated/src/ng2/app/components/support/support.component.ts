import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../services/support/support.service';
import { RemoteSession } from './class/remote-sessions';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  list: Array<RemoteSession> = [];
  constructor(private supportService: SupportService) { }

  ngOnInit() {
    this.supportService.getRemoteSessions().subscribe(data => {
      this.list = data;
      console.log("this.list", this.list);
    })
  }

}
