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
  public removeSignature() {
    return this.http.delete(this.apiUrl + `settings/userProfile/signature`);
  }
  public setSignature(content) {
    return this.http.post(this.apiUrl + `settings/userProfile/signature`, { content: content });
  }
  public editSignature(content) {
    return this.http.put(this.apiUrl + `settings/userProfile/signature`, { content: content });
  }
}
