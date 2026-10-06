
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberService } from '../gl-number.service';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { ClickOutsideDirective } from 'src/app/directives/click-otside/click-otside.directive';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule, ClickOutsideDirective],
  selector: 'add-gl-number',
  templateUrl: './add-gl-number.component.html',
  styleUrls: ['./add-gl-number.component.scss']
})
export class AddGlNumberComponent implements OnInit {
  addGl: GlNumber = new GlNumber();
  validateShort: boolean = true;
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  isInit: boolean = false;
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
    if (this.addGl.glNumber.length === 0) this.validateShort = false;
    if (this.addGl.glNumber.length === 0 || this.disableCreate || this.isInitRequest) return;
    if (!this.validateShort) return;
    this.isInitRequest = true;
    this.glNumberService
      .saveGL(this.addGl.getDataForAdd()).pipe(map((res) => res),
        catchError(error => of(undefined)))
      .subscribe(() => {
        this.onClose.emit(null);
        this.isInitRequest = false;
      }, err => {
        this.isInitRequest = false;
      });
  }
  onKeyUp(event) {
    this.isInit = true;
    if (event.keyCode === 13) this.onAddGL();
  }
}
