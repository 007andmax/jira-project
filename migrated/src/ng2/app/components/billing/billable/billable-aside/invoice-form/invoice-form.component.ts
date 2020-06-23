import { Component, OnInit, Input } from '@angular/core';
import { InvoiceLock } from '../../class/invoice-lock';
import { Company } from 'src/ng2/app/interfaces/company/company';
 

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
 @Input() invoice:InvoiceLock;
 @Input() company:Company;
  constructor() { }

  ngOnInit() {
  }

}
