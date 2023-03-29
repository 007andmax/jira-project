import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})

export class RemoteControlService {
    constructor(private http: HttpClient) {}

    getViewer() {
        return this.http.get<any>(CONFIG.getViewerURL, {
          responseType: 'blob' as 'json', observe: 'response', reportProgress: true
        })
        .pipe(map(data => {
            const blob = new Blob([data.body], { type: 'application/octet-stream' });
            const head = data.headers.get('content-disposition').split('=');
            saveAs(blob, head[1]);
        }))
    }

    createConnection(data: any) {
        return this.http.get<any>(CONFIG.createConnectionURL + 'deviceId=' + data.deviceId + '&connectionType=' + data.type + '&companyId=' + data.companyId)
        .pipe(map(data => {
            return data;
        }))
    }

    getConstant() {
        return this.http.get<any>(CONFIG.getConstant)
        .pipe(map(data => {
            return data;
        }))
    }
}