import { Injectable, EventEmitter } from '@angular/core';
import { GlNumberService } from '../../services/gl-number/gl-number.service';
import { GlNumberRealTimeService } from './gl-number-real-time.service';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { GlNumberChange } from 'src/ng2/class/gl-number/gl-number-change';

@Injectable({
  providedIn: 'root'
})
export class GlNumberStateService {
  glNumbers: Array<GlNumber> = [];
  onChangeGlNumbers: EventEmitter<GlNumberChange> = new EventEmitter();
  onGetGLNumbers: EventEmitter<any> = new EventEmitter();

  constructor(private glNumberService: GlNumberService,
    private glNumberRealTimeService: GlNumberRealTimeService
  ) { }

  public onInit() {

    this.glNumberService.getGlNumbers().subscribe((data) => {
      this.setGlNumbers(data);
      this.onInitGetGLNumbers(data);
    })

    this.glNumberRealTimeService.changeGlNumberArray.subscribe(newChange => {
      if (newChange.action === "GL_NUMBER_SAVED") {
        let index = this.glNumbers.findIndex(item => item.id === newChange.data.id);
        if (index > -1) {
          this.glNumbers[index] = new GlNumber(newChange.data);
          if (newChange.data.blockTime || newChange.data.serviceContract) {
            this.glNumbers.forEach((item, indexItem) => {
              if (newChange.data.blockTime && index !== indexItem) {
                item.blockTime = false;
              }
              if (newChange.data.serviceContract && index !== indexItem) {
                item.serviceContract = false;
              }
            });
          }
        } else {
          this.glNumbers.push(new GlNumber(newChange.data));
          this.glNumbers = this.glNumbers.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
            1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
        }
        console.log("this.glNumbers",this.glNumbers);
        this.onInitGetGLNumbers(this.glNumbers);
        //this.onChangeGlNumbers.emit(new GlNumberChange(newChange.action, newChange.data, this.glNumbers));
      }
    })
  }
  public getOnGlNumbers() {
    return this.onGetGLNumbers;
  }
  public getGLNumbers() {
    return this.glNumbers;
  }
  public setGlNumbers(data) {
    this.glNumbers = data;
  }

  public onInitGetGLNumbers(data) {
    this.onGetGLNumbers.emit(data);
  }
}
