import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TehUsersService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  /**
  * Get services list
  * @param clientCompanyId - client company id
  */
  public getUsersList() {
    return this.http.get(this.apiUrl + `users`).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * check error
   * @param error - error
   */
  private handleError = (error) => {
    let err = error.error;
    //this.quoteStateService.setError((err.validationResults && err.validationResults.saleQuotePostDto) ? err.validationResults.saleQuotePostDto : err.message);
    return throwError(error);
  }
}
