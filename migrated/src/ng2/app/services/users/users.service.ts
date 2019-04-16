import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import "rxjs-compat/add/operator/map";
import { WebsocketService } from '../websocket.service';
import { Observable, Subject } from "rxjs/Rx";


@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl;
  public currentUser: any;
  public messages: Subject<any>;

  constructor(
    private http: HttpClient,
    private wsService: WebsocketService,
  ) {

  }
  getAllusers(){
    return this.http.get(this.apiUrl + 'users');
  }

  getCurrentUser(){
    return this.http.get(this.apiUrl + 'users/current').subscribe((res) => {
      this.currentUser = res;
    });
  }

  // getNewCurrentUserPermissions(){
  //   var observable = this.http.post(this.apiUrl + 'user/watch/permissions', {})
  //     .map(response => {
  //       console.log(response, 'RESPONSE');
  //       response.json()
  //     }) // in case you care about returned json
  //     .publishReplay();
  //
  //   observable.connect();
  //   return observable;
  // }

}
