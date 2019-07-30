import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/ng2/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError, forkJoin, Observable } from 'rxjs';
import { CreateRecurringTickets } from '../../components/tickets/recurring-tickets/recurring-tickets-edit-aside/class/create-recurring-tickets';
import { RecurringTicket } from '../../components/tickets/recurring-tickets/class/recurring-ticket';

@Injectable({
  providedIn: 'root'
})
export class RecurringService {
  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient) { }

  public onInitEditProducts(products): Observable<any[]> {
    let out = [];
    products.forEach(element => {
      out.push(this.http.post(this.apiUrl + `products`,element))
    });
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin(out);
  }

  public editProduct(data) {
    return this.http.post(this.apiUrl + `products`,data).pipe(
      tap(data => data), 
      catchError(this.handleError));
  }

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
  public removeTicket(id:string) {
    return this.http.delete(this.apiUrl + `recurringTickets/${id}`).pipe(
      tap(res => res), 
      catchError(this.handleError));
  }
  public suspendTicket(id:string) {
    return this.http.post(this.apiUrl + `recurringTickets/${id}/suspend`,{}).pipe(
      tap(res => res), 
      catchError(this.handleError));
  }
  public resumeTicket(id:string) {
    return this.http.post(this.apiUrl + `recurringTickets/${id}/resume`,{}).pipe(
      tap(res => res), 
      catchError(this.handleError));
  }
  public editTicket(ticket:RecurringTicket, data:CreateRecurringTickets) {
    return this.http.put(this.apiUrl + `recurringTickets/${ticket.id}/edit`, data).pipe(
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
