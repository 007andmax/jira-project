import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';

@Component({
  selector: 'invoice-change-address',
  templateUrl: './invoice-change-address.component.html',
  styleUrls: ['./invoice-change-address.component.scss']
})
export class InvoiceChangeAddressComponent implements OnInit {
  @Input() company: CompanyProfile = new CompanyProfile();
  @Output() onSelectAddress = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  selectAddress(currentAddress, WithNewAddress) {
    this.onSelectAddress.emit({ currentAddress: currentAddress, WithNewAddress: WithNewAddress })
  }
}
