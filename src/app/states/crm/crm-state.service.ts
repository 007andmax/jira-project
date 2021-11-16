import { Injectable } from '@angular/core';
import { CrmRealTimeService } from './crm-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class CrmStateService {

  constructor(private crmRealTimeService: CrmRealTimeService) { }
  public onInit() {
    this.crmRealTimeService.changeCrmArray.subscribe(data => {

    })
  }
}
