import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";;
import { environment } from "../../../environments/environment";

/**
 * Note service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = environment.apiUrl;

  /**
   * Note api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  /**
   * Update note
   * @param id - id of note
   * @param data - note data for updated note
   */
  public updateNote(data, id) {
    return this.http.post(`${this.apiUrl}invoice/updateInvoiceNote/${id}`, data);
  }
  public removeNoteTemplate(id) {
    return this.http.delete(`${this.apiUrl}noteTemplates/${id}`);
  }
  public getKeywords() {
    return this.http.get(`${this.apiUrl}noteTemplates/keywords`);
  }
  public addNoteTemplate(data) {
    return this.http.post(`${this.apiUrl}noteTemplates`, data);
  }
  public editNoteTemplate(id, data) {
    return this.http.put(`${this.apiUrl}noteTemplates/${id}`, data);
  }
  public getNoteTemplate(id) {
    return this.http.get(`${this.apiUrl}noteTemplates/${id}`);
  }

  public getNotesTemplates(sort) {
    return this.http.get(`${this.apiUrl}noteTemplates?titleSortDirection=${sort}`);
  }
  public getActiveNotesTemplates() {
    return this.http.get(`${this.apiUrl}noteTemplates?titleSortDirection=asc&active=true`);
  }
}
