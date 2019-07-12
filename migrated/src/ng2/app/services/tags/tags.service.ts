import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private apiUrl = environment.apiUrl;

 /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   * @param {QuoteStateService} quoteStateService  Service to work with quote state
   */
  constructor(
    private http: HttpClient
  ) {}


  public getTags() {
    return this.http.get(this.apiUrl + `tags/getAll`).pipe(
      tap((data:any) => data.data));
  }
}
