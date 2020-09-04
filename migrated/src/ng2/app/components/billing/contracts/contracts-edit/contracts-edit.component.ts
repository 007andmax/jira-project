import { Component, OnInit, Input } from '@angular/core';
import { ServiceAgreement } from '../class/service-agreement';

@Component({
  selector: 'app-contracts-edit',
  templateUrl: './contracts-edit.component.html',
  styleUrls: ['./contracts-edit.component.scss']
})
export class ContractsEditComponent implements OnInit {
  @Input() serviceAgreement: ServiceAgreement;
  constructor() { }

  ngOnInit() {
  }

}
