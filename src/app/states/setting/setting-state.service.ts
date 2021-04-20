import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingStateService {
  componentName: string;
  constructor() { }
  public setComponentName(data) {
    this.componentName = data;
  }
  public getComponentName() {
    return this.componentName;
  }
}
