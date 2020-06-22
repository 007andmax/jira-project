import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-invoice-form-edit-customer',
  templateUrl: './invoice-form-edit-customer.component.html',
  styleUrls: ['./invoice-form-edit-customer.component.scss']
})
export class InvoiceFormEditCustomerComponent implements OnInit {
  @ViewChild('addresstext') addresstext: any;
  locationIsinit: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  public onCheckGoogleAutoComplete() {
    if (!this.locationIsinit) this.getPlaceAutocomplete();
  }
  private getPlaceAutocomplete() {
    this.locationIsinit = true;
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: null,
        types: ['address']  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();

      this.invokeEvent(place);
    });
  }
  invokeEvent(place: any) {

   /* this.company.addresses[0].locationLat = place.geometry.location.lat();
    this.company.addresses[0].locationLng = place.geometry.location.lng();
    this.company.addresses[0].address = this.addresstext.nativeElement.value;
    this.company.addresses[0].addressWithSuitNumberAndPostalCode = place.formatted_address;
    place.address_components.forEach(item => {
      if (item.types.indexOf('postal_code') !== -1) {
        this.company.addresses[0].postalCode = item.short_name;
      }
      if (item.types.indexOf('country') !== -1) {
        this.company.addresses[0].countryCode = item.short_name;
      }
      this.cd.detectChanges();
    })
*/
  }
}
