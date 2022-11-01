import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignatureStateService {
  signatureForRemove;
  constructor() { }
  public setSignatureForRemove(data) {
    this.signatureForRemove = data;
  }
  public getSignatureForRemove() {
    return this.signatureForRemove;
  }
}
