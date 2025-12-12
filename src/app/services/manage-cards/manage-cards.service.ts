import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
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
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }
  public editCard(data) {
    this.appStateService.setServerError(true);
    return this.http.put(this.apiUrl + `moneris/cards/${data.id}`, data).pipe(
      tap((data: any) => {
        this.appStateService.setServerError(false);
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public deleteCard(cardId) {
    this.appStateService.setServerError(true);
    return this.http.delete(this.apiUrl + `moneris/cards/${cardId}`).pipe(
      tap((data: any) => {
        this.appStateService.setServerError(false);
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addCard(data) {
    this.appStateService.setServerError(true);
    return this.http.post(this.apiUrl + 'moneris/cards', data).pipe(
      tap((data: any) => {
        this.appStateService.setServerError(false);
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public getCard(card_id) {
    return this.http.get(this.apiUrl + `moneris/cards/${card_id}`);
  }
  public getCards(page) {
    return this.http.get(this.apiUrl + `moneris/cards?page=${page}&size=20`);
  }

}
