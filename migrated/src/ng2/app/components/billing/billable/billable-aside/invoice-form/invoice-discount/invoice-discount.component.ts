import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvoiceDiscount } from './class/invoice-discount';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';

@Component({
  selector: 'app-invoice-discount',
  templateUrl: './invoice-discount.component.html',
  styleUrls: ['./invoice-discount.component.scss']
})
export class InvoiceDiscountComponent implements OnInit {
  @Input() lockId: string;
  @Output() onDelete = new EventEmitter();
  discount: InvoiceDiscount = new InvoiceDiscount();
  canRemove:boolean = false;
  constructor(private billableService: BillableService,) { }

  ngOnInit() {
  }
  delete() {
    this.billableService.deleteDiscount(this.lockId).subscribe(data => {
      this.onDelete.emit(null);
      this.canRemove = false;
    })
  }
  onChange() {
    this.billableService.addDiscount(this.lockId, this.discount).subscribe(data => {
      console.log("data", data);
      this.canRemove = true;
    })
  }
}
