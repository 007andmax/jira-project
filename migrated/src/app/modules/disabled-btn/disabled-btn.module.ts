import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisabledBtnDirective } from '../../directives/disabled-btn.directive';
import { AppComponent } from '../../app.component';

@NgModule({
  declarations: [ DisabledBtnDirective],
  imports: [
    CommonModule
  ],
  bootstrap: [AppComponent],
  exports:[DisabledBtnDirective]
})
export class DisabledBtnModule { }
