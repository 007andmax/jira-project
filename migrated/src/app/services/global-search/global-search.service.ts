import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GlobalSearchResult } from '../../components/header/global-search/class/global-search-result';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {

  private apiUrl = environment.apiUrl;

  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  public search(word) {
    return this.http.get(`${this.apiUrl}globalSearch?word=${word}`).pipe(map((data: any) => data.map(item => new GlobalSearchResult(item))));
  }

}
