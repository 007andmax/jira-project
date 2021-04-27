import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TagsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllTickets() {
    return this.http.get(`${this.apiUrl}tags/getAll`);
  }



  getAllCompany() {
    return this.http.get(`${this.apiUrl}company/tags/getAll`);
  }

  saveAllowingCreateCustomTags(value) {
    return this.http.put(`${this.apiUrl}settings/companyProfile/allowUsersCreateTags?allow=${value}`, {});
  }

  tags(tags, tag) {
    if (tag === "ticket") {
      return this.http.post(`${this.apiUrl}tags`, tags);
    } else {
      return this.http.post(`${this.apiUrl}company/tags`, tags);
    }
  }

  setWordForTag(tagId, word, tag) {
    if (tag === "ticket") {
      return this.http.put(
        `${this.apiUrl}tags/setWordForTag?tagId=${tagId}&word=${word}`,
        {}
      );
    } else {
      return this.http.put(
        `${this.apiUrl}company/tags/setWordForTag?tagId=${tagId}&word=${word}`,
        {}
      );
    }
    // https://dev.quicktech.com/tags/setWordForTag?tagId=50299099-52cd-465d-a2e7-f4bf69954345&word=acrobat
  }

  removeCompanyTag(tagId: string, tag: string) {
    if (tag === "ticket") {
      return this.http.delete(`${this.apiUrl}tags/removeTag?tagId=${tagId}`);
    }
    return this.http.delete(
      `${this.apiUrl}company/tags/removeTag?tagId=${tagId}`
    );
  }

  // create https://dev.quicktech.com/tags   {"colorCode":0,"usedCounter":0,"word":"test"}
}
