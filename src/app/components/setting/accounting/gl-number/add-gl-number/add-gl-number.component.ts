import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private glNumberService: GlNumberService,) { }

  ngOnInit() {
  }
  resetValidate() {
    this.validateShort = true;

  }
  onAddGL() {
    console.log("onAddGL");
    if (this.addGl.glNumber.length === 0) return;
    if (this.addGl.glNumber.length < 1) this.validateShort = false;

    if (!this.validateShort) return;
    this.glNumberService
      .saveGL(this.addGl.getDataForAdd())
      .subscribe(() => {
        this.onClose.emit(null);

      });
  }
}
