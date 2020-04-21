import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../../components/tickets/class/ticket';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient) { }

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
