import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'contracts-statistics',
  templateUrl: './contracts-statistics.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./contracts-statistics.component.scss']
})
export class ContractsStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
