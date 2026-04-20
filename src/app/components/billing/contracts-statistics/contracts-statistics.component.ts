import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations';
import { ContractsStatisticsTableComponent } from './contracts-statistics-table/contracts-statistics-table.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'contracts-statistics',
    templateUrl: './contracts-statistics.component.html',
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./contracts-statistics.component.scss'],
    standalone: true,
    imports: [NgbTooltipModule, ContractsStatisticsTableComponent]
})
export class ContractsStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
