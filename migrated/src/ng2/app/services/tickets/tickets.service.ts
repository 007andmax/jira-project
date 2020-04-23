import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../../components/tickets/class/ticket';
import { map } from 'rxjs/operators';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient) { }

  public getTicket(id) {
    return this.http.get(this.apiUrl + `v2/tickets/${id}`).pipe( map((data:any) => new TicketProfile(data)));
  }
  public getActualNumber() {
    return this.http.get(this.apiUrl + `data/actualNumber?type=TICKET`);
  }
  public addTicket(data) {
    return this.http.post(this.apiUrl + `v2/tickets`,data);
  }
  public getCount(data) {
    return this.http.post(this.apiUrl + `v2/tickets/count`,data);
  }
  public getCounts(data) {
    
    return this.http.post(this.apiUrl + `v2/tickets/counts`,data);
  }
  public getTickets(listType,data) {
    return this.http.post(this.apiUrl + `v2/tickets/getTickets?listType=${listType}`,data).pipe(map((data: any) => data.map(item => new Ticket(item))));
  }
}
