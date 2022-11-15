import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingStateService {
  componentName: string;
  sessionForRemove: any;
  constructor() { }
  public setComponentName(data) {
    this.componentName = data;
  }
  public setSessionForRemove(data) {
    this.sessionForRemove = data;
  }
  public getSessionForRemove() {
    return this.sessionForRemove;
  }
  public getComponentName() {
    return this.componentName;
  }
}
