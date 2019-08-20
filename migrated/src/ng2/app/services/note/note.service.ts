import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
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
   * Create new note
   * @param data - new note data
   */
  public createNote(data) {
    return this.http.post(`${this.apiUrl}invoice/createInvoiceNote?createRegular=${data.noteType === "REGULAR"}` ,data);
  }

  /**
   * Update note
   * @param id - id of note
   * @param data - note data for updated note
   */
  public updateNote(data, id) {
    return this.http.post(`${this.apiUrl}invoice/updateInvoiceNote/${id}` ,data);
  }

}
