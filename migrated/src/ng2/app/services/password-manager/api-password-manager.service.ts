import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Subject } from "rxjs";
import { ISubscription } from "rxjs-compat/Subscription";

@Injectable({
  providedIn: 'root'
})
export class ApiPasswordManagerService {

  public apiUrl = environment.apiUrl;
  public dataChange = new Subject<any>();
  private subGetRecords: ISubscription;

  constructor(private http: HttpClient) {}

  getRecords() {
    console.log('getRecords');
    this.subGetRecords = this.http.get(this.apiUrl + 'passwordRecords').subscribe((response)=> {
      this.dataChange.next(response);
      this.subGetRecords.unsubscribe();
    })
  }

  deleteRecord(recordId) {
    return this.http.delete(this.apiUrl + `passwordRecords/${recordId}`);
  }

  deleteSubscription() {
    console.log('teste12351235');
    this.subGetRecords.unsubscribe();
  }
}
