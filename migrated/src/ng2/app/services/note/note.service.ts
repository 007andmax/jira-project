import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public createNote(data) {
    return this.http.post(`${this.apiUrl}invoice/createInvoiceNote?createRegular=${data.noteType === "REGULAR"}` ,data);
  }

  public updateNote(data, id) {
    return this.http.post(`${this.apiUrl}invoice/updateInvoiceNote/${id}` ,data);
  }

}
