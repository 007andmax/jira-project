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
  constructor(private http: HttpClient) { }

  public changeSubjectNoteTicket(id, subject,note) {
    let data = { id: id,subject:subject,note:note };
    return this.http.put(this.apiUrl + `v2/tickets/edit`, data);
  }

  public updateTicket(data) {
    
    return this.http.post(this.apiUrl + `v2/tickets/updates?close=false`, data);
  }
  public reportAsSpamTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/reportAsSpam`, data);
  }
  public markAsSpamTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/markAsSpam`, data);
  }
  public trashTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/trash`, data);
  }
  public linkedAgentToTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/linkedAgent`, data);
  }
  public assignUserToTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/assign`, data);
  }

  public addTags(id, tags) {
    return this.http.put(this.apiUrl + `tags?ticketId=${id}`, tags)
  }
  public addAssignUsers(id, ids) {
    return this.http.put(this.apiUrl + `v2/tickets/${id}/assign`, { value: ids.join(",") })
  }
  public getTicket(id) {
    return this.http.get(this.apiUrl + `v2/tickets/${id}`).pipe(map((data: any) => new TicketProfile(data)));
  }
  public getActualNumber() {
    return this.http.get(this.apiUrl + `data/actualNumber?type=TICKET`);
  }
  public addTicket(data) {
    return this.http.post(this.apiUrl + `v2/tickets`, data);
  }
  public getCount(data) {
    return this.http.post(this.apiUrl + `v2/tickets/count`, data);
  }
  public getCounts(data) {

    return this.http.post(this.apiUrl + `v2/tickets/counts`, data);
  }
  public getTickets(listType, data) {
    return this.http.post(this.apiUrl + `v2/tickets/getTickets?listType=${listType}`, data).pipe(map((data: any) => data.map(item => new Ticket(item))));
  }
}
