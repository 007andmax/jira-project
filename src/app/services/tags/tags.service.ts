import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Tag } from '../../interfaces/tag/tag';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }

  saveAllowingCreateCustomTags(value) {
    return this.http.put(`${this.apiUrl}settings/companyProfile/allowUsersCreateTags?allow=${value}`, {});
  }

  search(page, partWord, filter = null) {
    if (partWord.length === 0) return this.http.get(this.apiUrl + `commonTags/getAll?page=${page}&size=20${(filter) ? '&defaultTag=COMMON' : ''}`)
    return this.http.get(this.apiUrl + `commonTags/filter?page=${page}&size=20&partWord=${partWord}${(filter) ? '&defaultTag=COMMON' : ''}`)
  }
  searchManageTag(page, partWord) {
    if (partWord.length === 0) return this.http.get(this.apiUrl + `commonTags/getAll?page=${page}&size=20&defaultTag=COMMON`)
    return this.http.get(this.apiUrl + `commonTags/filter?page=${page}&size=20&partWord=${partWord}&defaultTag=COMMON`)
  }
  searchFilesTags(page, partWord) {
    return this.http.get(`${this.apiUrl}commonTags/${partWord != '' ? 'filter' : 'getAll'}?page=${page}&size=20${partWord != '' ? `&partWord=${partWord}` : ''}&defaultTag=FILE_TAG`)
  }
  getTagsCompanyById(companyId) {
    return this.http.get(this.apiUrl + `commonTags/filter?page=0&size=20&companyId=${companyId}`)

  }
  setWordForTag(tagId, word, tag) {
    if (tag === "ticket") {
      return this.http.put(
        `${this.apiUrl}tags/setWordForTag?tagId=${tagId}&word=${word}`,
        {}
      ).pipe(
        tap(data => {
          this.toastrService.success("The tag has been successfully updated");
          this.appStateService.changeDetectorRef();
          return data;
        }));
    } else {
      return this.http.put(
        `${this.apiUrl}commonTags/setWordForTag?tagId=${tagId}&word=${word}`,
        {}
      ).pipe(
        tap(data => {
          this.toastrService.success("The tag has been successfully updated");
          this.appStateService.changeDetectorRef();
          return data;
        }));
    }
  }

  removeCompanyTag(tagId: string, tag: string) {
    if (tag === "ticket") {
      return this.http.delete(`${this.apiUrl}tags/removeTag?tagId=${tagId}`).pipe(
        tap(data => {
          this.toastrService.success("Tag Removed Successfully");
          this.appStateService.changeDetectorRef();
          return data;
        }));
    }
    return this.http.delete(
      `${this.apiUrl}commonTags/removeTag?tagId=${tagId}`
    ).pipe(
      tap(data => {
        this.toastrService.success("Tag Removed Successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public setTagsUser(user_id, data) {
    return this.http.put(this.apiUrl + `commonTags/user/${user_id}`, data);
  }
  public getTags() {
    return this.http.get(this.apiUrl + `tags/getAll`).pipe(
      tap((data: any) => data.data));
  }

  tags(tags, tag) {
    if (tag === "ticket") {
      return this.http.post(`${this.apiUrl}tags`, tags).pipe(
        tap(data => {
          this.toastrService.success("The new tag has been successfully created");
          this.appStateService.changeDetectorRef();
          return data;
        }));
    } else {
      return this.http.post(`${this.apiUrl}commonTags`, tags).pipe(
        tap(data => {
          this.toastrService.success("The new tag has been successfully created");
          this.appStateService.changeDetectorRef();
          return data;
        }));
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
