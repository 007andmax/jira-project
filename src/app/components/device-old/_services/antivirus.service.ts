import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})

export class AntivirusService {
    constructor(private http: HttpClient) {}

    getAllAntivirusList() {
        return this.http.get<any>(CONFIG.getAllAntivirusListURL)
        .pipe(map(data => {
            return data;
        }))
    }
}