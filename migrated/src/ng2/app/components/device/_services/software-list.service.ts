import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class SoftwareListService {
    constructor(private http: HttpClient) {}

    getAllSoftwareList () {
        return this.http.get<any>(CONFIG.getAllSoftwareListURL)
        .pipe(map(data => {
            return data;
        }))
    }

    deleteSoftware (data: any) {
        return this.http.post<any>(CONFIG.deleteSoftwareURL, data)
        .pipe(map(data => {
            return data;
        }))
    }
}