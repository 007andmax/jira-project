import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.scss']
})
export class ServicesTableComponent implements OnInit {

  public showServices = false;
  constructor() { }

  ngOnInit() {
  }

  public toggleShowServices() {
    this.showServices = !this.showServices;

  }

}
