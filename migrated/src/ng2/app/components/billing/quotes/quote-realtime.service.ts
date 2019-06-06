import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuoteRealtimeService {

  constructor() { }

  public handleRealTimeChanges(newChange) {
    console.log(newChange, 'newChange');
    // this.quoteStateService.handleRealTimeChanges(newChange);
    // if (newChange.action === 'SALE_QUOTE_CREATED') {
    //   this.itemsArray.push(newChange.data);
    // } else {
    //   this.itemsArray.map((item) => {
    //     if (item.id === newChange.data.id) {
    //       return item = newChange.data;
    //     } else {
    //       return item
    //     }
    //   })
    // }
  }

}
