import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignatureService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public getSignature() {
    return this.http.get(this.apiUrl + `settings/userProfile/signature`);
  }
}
