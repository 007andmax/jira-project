import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from 'src/ng2/environments/environment';
import { RemoteSession } from '../../components/support/class/remote-sessions';
import { Ticket } from '../../components/tickets/class/ticket';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  private apiUrl = environment.apiUrl;

  /**
    * Product api service constructor
    * @param {HttpClient} http Service to work with request
    */
  constructor(
    private http: HttpClient
  ) { }

  public getRemoteSessions() {
    return this.http.get(this.apiUrl + `remote/getRemoteSessions`).pipe(map((data: any) => data.map(item => new RemoteSession(item))));
  }
}
