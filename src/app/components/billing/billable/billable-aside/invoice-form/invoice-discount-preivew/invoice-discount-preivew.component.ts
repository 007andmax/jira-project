import { Component, Input } from '@angular/core';
import { InvoiceDto } from '../../../class/invoice-dto';
import { InvoiceDiscount } from '../invoice-discount/class/invoice-discount';

@Component({
  selector: 'app-invoice-discount-preivew',
  templateUrl: './invoice-discount-preivew.component.html',
  styleUrls: ['./invoice-discount-preivew.component.scss']
})
export class InvoiceDiscountPreivewComponent {
  @Input() invoiceDiscount: InvoiceDiscount;
}
