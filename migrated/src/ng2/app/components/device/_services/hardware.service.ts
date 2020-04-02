import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  constructor(private http: HttpClient) { }


  getAllHardwareList(companyUuid: string, agentId: string) {
    return this.http.post<any>(CONFIG.getAllHardwareListURL + companyUuid, [agentId])
      .pipe(map(data => {
        return data;
      }));
  }
}
