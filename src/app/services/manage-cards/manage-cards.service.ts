import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageCardsService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  public addCard(data) {
    return this.http.post(this.apiUrl + 'moneris/cards', data);
  }
  public getCards(page) {
    return this.http.get(this.apiUrl + `moneris/cards?page=${page}&size=20`);
  }

}
