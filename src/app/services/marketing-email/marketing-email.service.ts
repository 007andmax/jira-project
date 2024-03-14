import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
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
    private toastrService: ToastrService,
    private appStateService: AppStateService,

  ) { }
  public getUsersList(subscription_id, subscribed) {
    return this.http.get(this.apiUrl + `users/byCustomSubscription?subscriptionId=${subscription_id}&subscribed=${subscribed}`);
  }
  public addUsers(subscription_id, data) {
    return this.http.put(this.apiUrl + `users/customSubscription/${subscription_id}`, data);
  }
  public removeUser(user_id, subscription_id) {
    return this.http.delete(this.apiUrl + `users/customSubscription/${user_id}?subscriptionId=${subscription_id}`);
  }
  public getList() {
    return this.http.get(this.apiUrl + 'subscription/customSubscription');
  }
  public removeSubscriptionType(subscription_id) {
    return this.http.delete(this.apiUrl + `subscription/customSubscription/${subscription_id}`).pipe(
      tap(data => {
        this.toastrService.success("The subscription has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));

  }
  public editSubscriptionType(subscription_id, name) {
    return this.http.put(this.apiUrl + `subscription/customSubscription/${subscription_id}`, { name: name });

  }
  public addSubscriptionType(name) {
    return this.http.post(this.apiUrl + 'subscription/customSubscription', { "name": name });
  }
}
