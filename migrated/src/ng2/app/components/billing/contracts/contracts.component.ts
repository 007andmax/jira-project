import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  showCreate = false;
  constructor() { }

  ngOnInit() {
  }

}
