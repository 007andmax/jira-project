import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';

@Component({
  selector: 'quote-aside-add-change-address',
  templateUrl: './quote-aside-add-change-address.component.html',
  styleUrls: ['./quote-aside-add-change-address.component.scss']
})
export class QuoteAsideAddChangeAddressComponent implements OnInit {

  @Input() company: CompanyProfile = new CompanyProfile();
  @Output() onSelectAddress = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  selectAddress(currentAddress, WithNewAddress) {
    this.onSelectAddress.emit({ currentAddress: currentAddress, WithNewAddress: WithNewAddress })
  }

}
