import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DraftEmailService {

  private apiUrl = environment.apiUrl;

  /**
    * Product api service constructor
    * @param {HttpClient} http Service to work with request
    */
  constructor(
    private http: HttpClient
  ) { }

  public removeAttachment(id) {
    return this.http.delete(this.apiUrl + `file/${id}`);
  }
  public sendMessage(message) {
    return this.http.post(this.apiUrl + `email/customEmail`, message);
  }
}
