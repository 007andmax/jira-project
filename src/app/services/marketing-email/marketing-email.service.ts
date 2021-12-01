import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketingEmailService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  public getList() {
    return this.http.get(this.apiUrl + 'subscription/customSubscription');
  }
  public removeSubscriptionType(subscription_id) {
    return this.http.delete(this.apiUrl + `subscription/customSubscription/${subscription_id}`);

  }
  public editSubscriptionType(subscription_id, name) {
    return this.http.put(this.apiUrl + `subscription/customSubscription/${subscription_id}`, { name: name });

  }
  public addSubscriptionType(name) {
    return this.http.post(this.apiUrl + 'subscription/customSubscription', { "name": name });
  }
}
