import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})

export class startupService {
    constructor(private http: HttpClient) {}

    getAllStartupList () {
        return this.http.get<any>(CONFIG.getALlStartupListURL)
        .pipe(map(data => {
            return data;
        }))
    }
}
