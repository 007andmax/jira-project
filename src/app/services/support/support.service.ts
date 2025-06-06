import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';

import { environment } from 'src/environments/environment';
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
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }
  public deleteRemoteSession(data) {
    return this.http.post(this.apiUrl + `remote/deleteRemoteSession`, data).pipe(
      tap(data => {
        this.toastrService.success("The remote session has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public createOneTimeRemoteSession() {
    return this.http.get(this.apiUrl + `remote/createOneTimeRemoteSession`).pipe(
      tap(data => {
        this.toastrService.success("The new remote session has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public getRemoteSessions() {
    return this.http.get(this.apiUrl + `remote/getRemoteSessions`).pipe(map((data: any) => data.map(item => new RemoteSession(item))));
  }
}
