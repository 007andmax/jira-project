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

  saveDeviceName(data: any) {
    return this.http.post<any>(CONFIG.saveDeviceNameURL, data)
      .pipe(map(data => {
        return data;
      }));
  }

  getVirusInfo(companyUuid: string) {
    return this.http.get<any>(CONFIG.getVirusInfoURL + companyUuid)
      .pipe(map(data => {
        return data;
      }));
  }
}
