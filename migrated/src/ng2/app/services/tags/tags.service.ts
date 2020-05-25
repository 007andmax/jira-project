import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Tag } from '../../interfaces/tag/tag';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private apiUrl = environment.apiUrl;

 /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   */
  constructor(
    private http: HttpClient
  ) {}
  public geCompanytTags() {
    return this.http.get(this.apiUrl + `company/tags/getAll`).pipe(
      tap((data:any) => data.data));
  }

  public setCompanyTags(word) {
    return this.http.post(this.apiUrl + `company/tags`, {word : word}).pipe(
      tap((data:any) => data.data));
  }

  public getTags() {
    return this.http.get(this.apiUrl + `tags/getAll`).pipe(
      tap((data:any) => data.data));
  }

  public setTags(tag:Tag) {
    return this.http.post(this.apiUrl + `tags`,tag).pipe(
      tap((data:any) => data.data));
  }
}
