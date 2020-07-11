import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})

export class TerminalService {
    constructor (private http: HttpClient) {}

    createCommand(data: any) {
        return this.http.post<any>(CONFIG.createCommandURL, data)
        .pipe(map(data => {
            return data;
        }))
    }

    getCommand() {
        return this.http.get<any>(CONFIG.getCommandURL)
        .pipe(map(data => {
            return data;
        }))
    }

    getCmdCategory() {
        return this.http.get<any>(CONFIG.getCmdCategoryURL)
        .pipe(map(data => {
            return data;
        }))
    }
}