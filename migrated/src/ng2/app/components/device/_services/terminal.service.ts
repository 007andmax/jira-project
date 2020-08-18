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

    updateCommand(data: any) {
        return this.http.put<any>(CONFIG.updateCommandURL, data)
        .pipe(map(data => {
            return data;
        }))
    }

    createCategory(data: any) {
        return this.http.post<any>(CONFIG.createCategoryURL + data.name, {})
        .pipe(map(data => {
            return data;
        }))
    }

    updateCategory(data: any) {
        return this.http.put<any>(CONFIG.updateCategoryURL + data.id + '/' + data.name, {})
        .pipe(map(data => {
            return data;
        }))
    }

    deleteCategory(id: string) {
        return this.http.delete<any>(CONFIG.deleteCategoryURL + id)
        .pipe(map(data => {
            return data;
        }))
    }

    deleteCommand(id: string) {
        return this.http.delete<any>(CONFIG.deleteCommandURL + id)
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