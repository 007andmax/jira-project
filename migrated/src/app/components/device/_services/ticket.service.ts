import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { CONFIG } from '../config/app-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class TicketService {
    constructor(private http: HttpClient) {}

    getAllTicketList (data: any) {
        return this.http.post<any>(CONFIG.getAllTicketListURL, data)
        .pipe(map(data => {
            return data;
        }))
    }

    getActualNumber() {
        return this.http.get<any>(CONFIG.getActualNumberURL)
        .pipe(map(data => {
            return data;
        }))
    }

    getAllCompanyClient() {
        return this.http.get<any>(CONFIG.getAllCompanyCLientURL)
        .pipe(map(data => {
            return data;
        }))
    }

    getAllUsers() {
        return this.http.get<any>(CONFIG.getAllUsersURL)
        .pipe(map(data => {
            return data;
        }))
    }

    createTicket(data: any) {
        return this.http.post<any>(CONFIG.createTicketURL, data)
        .pipe(map(data => {
            return data;
        }))
    }
}