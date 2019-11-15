import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Tag } from 'src/ng2/app/interfaces/quote/tag';

@Injectable({
  providedIn: 'root'
})
export class CompanyTagsService {

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
     return this.http.get(this.apiUrl + `company/tags/getAll`).pipe(
       tap((data:any) => data.data));
   }
 
   public setTags(word) {
     return this.http.post(this.apiUrl + `company/tags`, {word : word}).pipe(
       tap((data:any) => data.data));
   }
}
