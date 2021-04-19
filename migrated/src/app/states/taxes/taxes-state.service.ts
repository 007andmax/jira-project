import { Injectable, EventEmitter } from '@angular/core';
import { TaxesService } from '../../services/taxes/taxes.service';
import { Tax } from 'src/class/taxes/tax';
import { TaxesRealTimeService } from './taxes-real-time.service';
import { TaxesChange } from 'src/class/taxes/taxes-change';

@Injectable({
  providedIn: 'root'
})
export class TaxesStateService {
  taxes: Array<Tax> = [];
  onGetTaxes: EventEmitter<any> = new EventEmitter();
  onChangeTaxes: EventEmitter<TaxesChange> = new EventEmitter();
  clearState = new EventEmitter<any>();
  taxesFromEdit: EventEmitter<any> = new EventEmitter();
  constructor(private taxesService: TaxesService, private taxesRealTimeService: TaxesRealTimeService) { }

  public onInit() {
    this.taxesService.getTaxes().subscribe((data) => {
      this.setTaxes(data);
      this.onInitGetTaxes(this.taxes);
    })

    this.taxesRealTimeService.changeTaxesArray.subscribe(newChange => {
      if (newChange.action === 'TAX_CREATED') this.taxes.push(newChange.data);
      if (newChange.action === 'TAX_UPDATED') {
        const Index = this.taxes.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.taxes[Index] = newChange.data;
      }
      if (newChange.action === 'TAX_DELETED') {
        const Index = this.taxes.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.taxes.splice(Index, 1);
      }
      this.setTaxes(this.taxes);
      this.onInitGetTaxes(this.taxes);
    })
  }
  public getTaxes() {
    return this.taxes;
  }
  public onInitGetTaxes(data) {
    this.onGetTaxes.emit(data);
  }
  public setTaxes(data) {
    this.taxes = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  /**
* Initializes to subscribe for clear data
*/
  public onInitClear() {
    this.clearState.emit(null);
  }

  /**
  * Get subscribe for clear data
  */
  public getClearState() {
    return this.clearState;
  }

  /**
  * Initializes to subscribe for edit mode
  */
  public setTaxesFromtEdit(data) {
    this.taxesFromEdit.emit(data);

  }

  /**
  * Get  subscribe for edit mode
  */
  public getTaxesFromEdit() {
    return this.taxesFromEdit;
  }
}
