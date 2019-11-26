import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  isMobile: boolean = false;
  onMobile: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public checkMobile() {
    return this.isMobile;
  }
  public getOnMobile() {
    return this.onMobile;
  }

  public setMobile(data) {
    this.isMobile = data;
    this.onMobile.emit(data);
  }

  public onCheckMobile =()=> {
    if (document.documentElement.clientWidth <= 414 && !this.checkMobile()) {
      this.setMobile(true);
    } else if (document.documentElement.clientWidth > 414 && this.checkMobile()) {
      this.setMobile(false);
    }
  }
}
