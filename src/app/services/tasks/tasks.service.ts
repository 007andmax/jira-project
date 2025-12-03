import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

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

  addTask(data) {
    return this.http.post(`${this.apiUrl}tasks`, data);
  }
  deleteTask(taskId) {
    this.appStateService.setServerError(true);
    return this.http.delete(`${this.apiUrl}tasks/${taskId}`).pipe(
      catchError((err) => {
        this.appStateService.setServerError(false);
        this.appStateService.changeDetectorRef();
        throw err;
      }),
      tap(data => {
        this.appStateService.setServerError(false);
        this.toastrService.success("The Task has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  editTask(taskId, data) {
    return this.http.put(`${this.apiUrl}/tasks/${taskId}`, data);
  }
  changeStatusTask(taskId, status) {
    return this.http.put(`${this.apiUrl}/tasks/${taskId}/status?status=${status}`, {});
  }
  getTasks(page, techUserId = null, filter = null, isArchived = false) {
    return this.http.get(`${this.apiUrl}tasks?size=10&page=${page}${techUserId ? `&userId=${techUserId}` : ''}${filter ? `&filter=${filter}` : ''}${isArchived ? `&archived=true` : ''}`);
  }
  getTaskDetail(taskId) {
    return this.http.get(`${this.apiUrl}tasks/${taskId}`);
  }
  getTasksCalendar(start, interval, techUserId = null, filter = null, isArchived = false) {
    return this.http.get(`${this.apiUrl}tasks/calendar?start=${start}&interval=${interval}${techUserId ? `&userId=${techUserId}` : ''}${filter ? `&filter=${filter}` : ''}${isArchived ? `&archived=true` : ''}`);
  }
  getStatistics(userId) {
    return this.http.get(`${this.apiUrl}tasks/statistics?userId=${userId}`);
  }
  archiveTask(id) {
    return this.http.put(`${this.apiUrl}tasks/archive/${id}`, {}).pipe(
      tap(data => {
        this.toastrService.success("The task has been successfully archived");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  deArchiveTask(id) {
    return this.http.put(`${this.apiUrl}tasks/dearchive/${id}`, {});
  }
}
