import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/ng2/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadAgentService {
  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient) { }

  public  archiveCompany (companyId,userName,userPassword,globalAutoInstall) {
    return this.http.get(this.apiUrl + 'data/prepareDownloadAgent?companyId=' + companyId + "&userName=" + userName +
    "&userPassword=" + userPassword + "&autoGlobalRemoteInstall=" + globalAutoInstall);
  }
}
