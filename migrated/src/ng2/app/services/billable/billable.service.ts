import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConstantsStateService } from '../../states/constants/constants-state.service';

@Injectable({
  providedIn: 'root'
})
export class BillableService {

  private apiUrl = environment.apiUrl;
 
  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private constantsStateService:ConstantsStateService
  ) { }

  public getBillable(){
    return this.http.get(this.apiUrl + `billable/billablePageInfo`);
  }
}
