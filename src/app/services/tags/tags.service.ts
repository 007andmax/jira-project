import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  ) { }
  public geCompanytTags() {
    return this.http.get(this.apiUrl + `commonTags/getAll`).pipe(
      tap((data: any) => data.data));
  }

  public setCompanyTags(companyId, word) {
    return this.http.post(this.apiUrl + `commonTags/company/${companyId}`, { word: word }).pipe(
      tap((data: any) => data.data));
  }

  public getTags() {
    return this.http.get(this.apiUrl + `tags/getAll`).pipe(
      tap((data: any) => data.data));
  }

  public setTags(tag: Tag) {
    return this.http.post(this.apiUrl + `commonTags`, tag).pipe(
      tap((data: any) => data.data));
  }
}
