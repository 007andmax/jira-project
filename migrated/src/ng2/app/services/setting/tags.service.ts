import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/ng2/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TagsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTickets() {
    return this.http.get(`${this.apiUrl}tags/getAll`);
  }

  getAllCompany() {
    return this.http.get(`${this.apiUrl}company/tags/getAll`);
  }

  tags(tags) {
    return this.http.post(`${this.apiUrl}company/tags`, tags);
  }

  setWordForTag(tagId, word) {
    return this.http.put(
      `${this.apiUrl}company/tags/setWordForTag?tagId=${tagId}&word=${word}`,
      {}
    );
  }

  removeCompanyTag(tagId: string) {
    return this.http.delete(
      `${this.apiUrl}company/tags/removeTag?tagId=${tagId}`
    );
  }
}
