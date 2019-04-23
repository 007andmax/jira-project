import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiPasswordManagerService {

  public apiUrl = environment.apiUrl;
  public dataChange = new Subject<any>();

  constructor(private http: HttpClient) {}

  getRecords() {
    return this.http.get(this.apiUrl + 'passwordRecords').subscribe((response)=> {
      this.dataChange.next(response);
    })
  }

  deleteRecord(recordId) {
    return this.http.delete(this.apiUrl + `passwordRecords/${recordId}`);
  }
}
