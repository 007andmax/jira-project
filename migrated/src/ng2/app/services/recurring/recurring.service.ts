import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/ng2/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CreateRecurringTickets } from '../../components/tickets/recurring-tickets/recurring-tickets-edit-aside/class/create-recurring-tickets';

@Injectable({
  providedIn: 'root'
})
export class RecurringService {
  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient) { }

  
  public getServiceList(clientCompanyId) {
    return this.http.get(this.apiUrl + `services/${clientCompanyId}`).pipe(
      tap(data => data), 
      catchError(this.handleError));
  }

  public getTicketsList(page_number,items_per_page,sort,direction) {
    return this.http.get(this.apiUrl + `recurringTickets?page=${page_number}&limit=${items_per_page}&sort=${sort}&direction=${direction}`).pipe(
      tap(data => data), 
      catchError(this.handleError));
  }


  public createTicket(data:CreateRecurringTickets) {
    return this.http.post(this.apiUrl + `recurringTickets/create`, data).pipe(
      tap(res => res), 
      catchError(this.handleError));
  }
  /**
   * check error
   * @param error - error
   */
  private handleError =(error)=> {
    let err = error.error;
    //this.quoteStateService.setError((err.validationResults && err.validationResults.saleQuotePostDto) ? err.validationResults.saleQuotePostDto : err.message);
    return throwError(error);
  }
}
