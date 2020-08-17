import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { Subscription } from 'rxjs';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';

@Component({
  selector: 'app-default-services-add',
  templateUrl: './default-services-add.component.html',
  styleUrls: ['./default-services-add.component.scss']
})
export class DefaultServicesAddComponent implements OnInit {
  glNumbers: Array<GlNumber> = [];
  sub: Subscription = new Subscription();
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @Output() onClose = new EventEmitter<any>();
  constructor(private glNumberStateService: GlNumberStateService,) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onTaxesChange(data) {

  }
  onAddGlNumber(data) {

  }
  onSelectGlNumbers(data) {


  }
  close() {
    this.onClose.emit(null);
  }
}
