import { Component, OnInit, AfterViewInit, Input, Output, ViewChild } from "@angular/core";
import {  EventEmitter } from '@angular/core'

declare var google: any;

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"]
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @Input() adressType: string;
  @Output() setAddress  = new EventEmitter();
  @ViewChild("addresstext") addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;
  place : any;

  constructor() {}

  ngOnInit() {
    console.log('autocomplete')
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        componentRestrictions: { country: "US" },
        types: [this.adressType] // 'establishment' / 'address' / 'geocode'
      }
    );
    google.maps.event.addListener(autocomplete, "place_changed", () => {
      this.place = autocomplete.getPlace();
      this.invokeEvent(this.place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(this.place);
  }
}
