import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberService } from '../gl-number.service';

@Component({
  selector: 'add-gl-number',
  templateUrl: './add-gl-number.component.html',
  styleUrls: ['./add-gl-number.component.scss']
})
export class AddGlNumberComponent implements OnInit {
  addGl: GlNumber = new GlNumber();
  validateShort: boolean = true;
  disableCreate: boolean = false;
  @Input() numberList: Array<GlNumber> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private glNumberService: GlNumberService,) { }

  ngOnInit() {
  }
  resetValidate() {
    this.validateShort = true;
  }
  checkDublicate() {
    var duplicate = this.numberList.filter((item) => {
      return item.glNumber.toLowerCase() === this.addGl.glNumber.toLowerCase();
    });
    if (duplicate && duplicate[0]) {
      return this.disableCreate = true;
    } else {
      return this.disableCreate = false;
    }
  };
  onAddGL() {
    if (this.addGl.glNumber.length === 0 || this.disableCreate) return;
    if (this.addGl.glNumber.length < 1) this.validateShort = false;
    if (!this.validateShort) return;
    this.glNumberService
      .saveGL(this.addGl.getDataForAdd()).pipe(map((res) => res),
        catchError(error => of(undefined)))
      .subscribe(() => {
        this.onClose.emit(null);
      });
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onAddGL();
  }
}
