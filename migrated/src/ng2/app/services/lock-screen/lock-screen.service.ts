import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
var md5 = require('md5');
@Injectable({
  providedIn: 'root',
})
export class LockScreenService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  public unlockScreen(code) {
    return this.http.post(this.apiUrl + 'unlockScreen', { code: md5(code) });
  }
  public sendUnlockScreenCode() {
    return this.http.get(this.apiUrl + 'sendUnlockScreenCode');
  }
}
