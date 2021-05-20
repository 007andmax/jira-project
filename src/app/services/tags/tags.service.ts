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
  getAllTickets() {
    return this.http.get(`${this.apiUrl}tags/getAll`);
  }

  public geCompanyTags() {
    return this.http.get(this.apiUrl + `commonTags/getAll`)
  }

  saveAllowingCreateCustomTags(value) {
    return this.http.put(`${this.apiUrl}settings/companyProfile/allowUsersCreateTags?allow=${value}`, {});
  }


  setWordForTag(tagId, word, tag) {
    if (tag === "ticket") {
      return this.http.put(
        `${this.apiUrl}tags/setWordForTag?tagId=${tagId}&word=${word}`,
        {}
      );
    } else {
      return this.http.put(
        `${this.apiUrl}commonTags/setWordForTag?tagId=${tagId}&word=${word}`,
        {}
      );
    }
    // https://dev.quicktech.com/tags/setWordForTag?tagId=50299099-52cd-465d-a2e7-f4bf69954345&word=acrobat
  }

  removeCompanyTag(tagId: string, tag: string) {
    if (tag === "ticket") {
      return this.http.delete(`${this.apiUrl}tags/removeTag?tagId=${tagId}`);
    }
    return this.http.delete(
      `${this.apiUrl}commonTags/removeTag?tagId=${tagId}`
    );
  }

  public getTags() {
    return this.http.get(this.apiUrl + `tags/getAll`).pipe(
      tap((data: any) => data.data));
  }

  tags(tags, tag) {
    if (tag === "ticket") {
      return this.http.post(`${this.apiUrl}tags`, tags);
    } else {
      return this.http.post(`${this.apiUrl}commonTags`, tags);
    }
  }
  public addTicketsTags(tag: Tag) {
    return this.http.post(this.apiUrl + `tags`, tag).pipe(
      tap((data: any) => data.data));
  }
  public addCompanyTags(tag: Tag) {
    return this.http.post(this.apiUrl + `commonTags`, tag).pipe(
      tap((data: any) => data.data));
  }
}
