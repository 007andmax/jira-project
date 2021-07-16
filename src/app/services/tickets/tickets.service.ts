import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from '../../components/tickets/class/ticket';
import { map, tap } from 'rxjs/operators';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';
import { DashboardTickets } from '../../components/tickets/tickets-dashboard/class/dashboard-tickets';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  public getDashboardByServices(data) {
    return this.http.post(this.apiUrl + `dashboard/ticket/byServices`, data);
  }
  public getDashboardByTech(startDate, endDate) {
    return this.http.get(this.apiUrl + `dashboard/ticket/counters?startDate=${startDate}&endDate=${endDate}`);
  }
  public getDashboard(frequency) {
    return this.http.get(this.apiUrl + `dashboard/ticket?frequency=${frequency}`).pipe(map((data: any) => new DashboardTickets(data)));
  }
  public updateExpense(data) {
    return this.http.put(this.apiUrl + `v2/tickets/ticketUpdate/updateExpense`, data).pipe(
      tap(data => {
        this.toastrService.success("The ticket update has been successfully changed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public updateNote(ticketId, updateId, note) {
    return this.http.put(this.apiUrl + `v2/tickets/${ticketId}/updates/${updateId}/updateNote`, { note: note }).pipe(
      tap(data => {
        this.toastrService.success("The note has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
  public changeSubjectNoteTicket(id, subject, note, companyId = null) {
    let data = { id: id, subject: subject, note: note, companyId: companyId };
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

    return this.http.delete(this.apiUrl + `v2/tickets/${ticketId}/updates/${updateId}/deleteExpenses`, options).pipe(
      tap(data => {
        this.toastrService.success("The ticket update has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public removeProduct(ticketId, updateId, productId) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { "productExpenseIds": [productId], "serviceExpenseIds": null }
    };

    return this.http.delete(this.apiUrl + `v2/tickets/${ticketId}/updates/${updateId}/deleteExpenses`, options).pipe(
      tap(data => {
        this.toastrService.success("The ticket update has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public downloadFile(id, contentType) {
    return this.http.get(this.apiUrl + `file/${id}/attachment`, {
      headers: new HttpHeaders({
        'Content-Type': contentType,
      }), responseType: 'blob'
    }).pipe(
      tap(data => data));
  }
  public deleteUpdate(id, updateId) {

    return this.http.delete(this.apiUrl + `v2/tickets/${id}/updates/${updateId}`).pipe(
      tap(data => {
        this.toastrService.success("The ticket update has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public deleteTicket(ids) {

    return this.http.post(this.apiUrl + `v2/tickets/delete/`, { ids: ids }).pipe(
      tap(data => {
        this.toastrService.success("The ticket has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public updateTicket(data, close = false) {

    return this.http.post(this.apiUrl + `v2/tickets/updates?close=${close}`, data).pipe(
      tap(data => {
        if (close) {
          this.toastrService.success("The ticket has been successfully closed.");
          this.appStateService.changeDetectorRef();
        } else {
          this.toastrService.success("The update has been added");
          this.appStateService.changeDetectorRef();
        }
        return data;
      }));
  }
  public changeStatus(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/status`, data);
  }
  public reportAsSpamTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/reportAsSpam`, data).pipe(
      tap(data => {
        this.toastrService.success("The ticket has been successfully changed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public markAsSpamTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/markAsSpam`, data).pipe(
      tap(data => {
        this.toastrService.success("The ticket has been successfully changed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public trashTicket(id, value) {
    let data = { value: value };
    return this.http.put(this.apiUrl + `v2/tickets/${id}/trash`, data).pipe(
      tap(data => {
        this.toastrService.success("The ticket has been successfully changed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
    return this.http.post(this.apiUrl + `v2/tickets`, data).pipe(
      tap(data => {
        this.toastrService.success("The new  ticket has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
