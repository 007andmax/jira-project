import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from '../../components/tickets/class/ticket';
import { map, tap } from 'rxjs/operators';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  public updateExpense(data) {
    return this.http.put(this.apiUrl + `v2/tickets/ticketUpdate/updateExpense`, data);
  }
  public fetchUpdates(ticket) {
    var loadedIds = [];
    if (ticket.updates) {
      for (var i = 0; i < ticket.updates.length; i++) {
        loadedIds.push(ticket.updates[i].id)
      }
    }
    return this.http.post(this.apiUrl + `v2/tickets/${ticket.id}/updates/fetch`, loadedIds);
  }
  public changeSubjectNoteTicket(id, subject, note) {
    let data = { id: id, subject: subject, note: note };
    return this.http.put(this.apiUrl + `v2/tickets/edit`, data);
  }
  public restoreFromSpam(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/restoreFromSpam`, data);
  }
  public removeService(ticketId, updateId, serviceId) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { "productExpenseIds": null, "serviceExpenseIds": [serviceId] }
    };

    return this.http.delete(this.apiUrl + `v2/tickets/${ticketId}/updates/${updateId}/deleteExpenses`, options);
  }
  public removeProduct(ticketId, updateId, productId) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { "productExpenseIds": [productId], "serviceExpenseIds": null }
    };

    return this.http.delete(this.apiUrl + `v2/tickets/${ticketId}/updates/${updateId}/deleteExpenses`, options);
  }
  public downloadFile(id,contentType) {
    return this.http.get( this.apiUrl + `file/${id}/attachment`,{
      headers: new HttpHeaders({
        'Content-Type': contentType,
      }), responseType: 'blob'
    }).pipe(
      tap(data => data));
  }
  public deleteUpdate(id, updateId) {

    return this.http.delete(this.apiUrl + `v2/tickets/${id}/updates/${updateId}`);
  }
  public deleteTicket(ids) {

    return this.http.post(this.apiUrl + `v2/tickets/delete/`, { ids: ids });
  }
  public updateTicket(data, close = false) {

    return this.http.post(this.apiUrl + `v2/tickets/updates?close=${close}`, data);
  }
  public changeStatus(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/status`, data);
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
