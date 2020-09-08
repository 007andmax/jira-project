import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})

export class CommonHttpServices {
    constructor (private http: HttpClient) {}

    getDevicesByCompany (uuid: string, agentId) {
        return this.http.get<any>(CONFIG.getVirusInfoURL + uuid + '&agentId' + agentId)
        .pipe(map(data => {
            return data;
        }))
    }

    getCurrentCompany () {
        return this.http.get<any>(CONFIG.getCurrentCompanyURL)
        .pipe(map(data => {
            return data;
        }))
    }

    getCurrentUser () {
        return this.http.get<any>(CONFIG.getCurrentUserURL)
        .pipe(map(data => {
            return data;
        }))
    }

    printPdf (data: any) {
        return this.http.post<any>(CONFIG.printPdfURL, data)
        .pipe(map(data => {
            return data;
        }))
    }
}