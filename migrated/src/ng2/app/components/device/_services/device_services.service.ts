import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})

export class DeviceServices {
    constructor (private http: HttpClient) {}

    getAllServicesList () {
        return this.http.get<any>(CONFIG.getAllServicesListURL)
        .pipe(map(data => {
            return data;
        }))
    }
}