import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadAgentService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public download(companyId, userName, userPassword, globalAutoInstall) {
    return this.http.get(this.apiUrl + 'data/prepareDownloadAgent?companyId=' + companyId + "&userName=" + userName +
      "&userPassword=" + userPassword + "&autoGlobalRemoteInstall=" + globalAutoInstall);
  }
  public downloadDemo(companyId) {
    return this.http.get(this.apiUrl + `data/downloadAgentV2?companyId=${companyId}`);
  }
}
