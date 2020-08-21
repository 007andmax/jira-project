import { Component, OnInit, Input } from '@angular/core';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';

@Component({
  selector: 'app-default-services-contracts',
  templateUrl: './default-services-contracts.component.html',
  styleUrls: ['./default-services-contracts.component.scss']
})
export class DefaultServicesContractsComponent implements OnInit {
  @Input() type: string = '';
  glNumbers: Array<GlNumber> = [];
  selectedGlNumber: GlNumber;
  constructor(private glNumberStateService: GlNumberStateService,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      this.selectedGlNumber = this.glNumbers.find(item => (this.type === 'BLOCK_TIME') ?  item.blockTime : item.serviceContract);
    })
    this.selectedGlNumber = this.glNumbers.find(item => (this.type === 'BLOCK_TIME') ?  item.blockTime : item.serviceContract);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  setGlNumberContract(glNumber) {
    this.glNumberService.setGlNumberContract(glNumber.id, (this.type === 'BLOCK_TIME') ? 'blockTime' : 'serviceContract').subscribe(data => {
      this.selectedGlNumber = new GlNumber(data);
    })
  }

}
