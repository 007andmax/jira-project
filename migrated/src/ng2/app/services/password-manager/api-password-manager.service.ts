import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Subject } from "rxjs";
import { ISubscription } from "rxjs-compat/Subscription";

/**
 * Password manager service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class ApiPasswordManagerService {

  public apiUrl = environment.apiUrl;
  public dataChange = new Subject<any>();
  private subGetRecords: ISubscription;

  /**
   * Password manager api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) {}

  /**
   * Get records list
   */
  public getRecords() {
    console.log('getRecords');
    this.subGetRecords = this.http.get(this.apiUrl + 'passwordRecords').subscribe((response)=> {
      this.dataChange.next(response);
    })
  }

  /**
   * Get records list
   */
  public getRecordsNew() {
    console.log('getRecordsNew');
    return this.http.get(this.apiUrl + 'passwordRecords');
  }

  /**
   * Delete record
   * @param recordId - id of record
   */
  public deleteRecord(recordId) {
    return this.http.delete(this.apiUrl + `passwordRecords/${recordId}`);
  }

  /**
   * Delete subscription
   */
  public deleteSubscription() {
    this.subGetRecords.unsubscribe();
  }
}
