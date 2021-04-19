import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }
  public getTicketsStatus() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=ticketsTagsColors');
  }
  public getColors() {
    return this.http.get(this.apiUrl + 'data/getColors');
  }
  public getIndustryHistory() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=companiesPageFilterByIndustryHistory');
  }
  public getIndustryHistoryUsers() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=userPageFilterByIndustryHistory');
  }
  public getCompaniesHistory() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=userPageFilterByCompanyHistory');
  }
  public getCompaniesHistoryTickets() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=ticketPageFilterByCompanyHistory');
  }
  public getCompaniesHistoryTicketsUser() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=ticketPageFilterByClientUsersHistory');
  }
  public getCompaniesHistoryTechUsers() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=ticketPageFilterByTechUsersHistory');
  }

  public getSalesHistory() {
    return this.http.get(this.apiUrl + 'customStorage/user?customKey=companiesPageFilterBySalesHistory');
  }
}
