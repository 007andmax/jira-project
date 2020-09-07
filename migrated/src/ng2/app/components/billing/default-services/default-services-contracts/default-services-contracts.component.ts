import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';

@Component({
  selector: 'app-default-services-contracts',
  templateUrl: './default-services-contracts.component.html',
  styleUrls: ['./default-services-contracts.component.scss']
})
export class DefaultServicesContractsComponent implements OnInit {
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @Input() type: string = '';
  glNumbers: Array<GlNumber> = [];
  selectedGlNumber: GlNumber = null;
  constructor(private glNumberStateService: GlNumberStateService,
    public cd: ChangeDetectorRef,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      this.selectedGlNumber = this.glNumbers.find(item => (this.type === 'BLOCK_TIME') ?  item.blockTime : item.serviceContract);
    })
    this.selectedGlNumber = this.glNumbers.find(item => (this.type === 'BLOCK_TIME') ?  item.blockTime : item.serviceContract);
     console.log("selectedGlNumber",this.selectedGlNumber);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onSelectGlNumbers(glNumber) {
    console.log("onSelectGlNumbers");
    if (glNumber == null) {
     
      this.glNumberService.resetContract((this.type === 'BLOCK_TIME') ? 'blockTime' : 'serviceContract').subscribe(data => {
        this.selectedGlNumber = null;
        this.glNumberSelect.clearWithOutChanges();
      })
    } else {
      this.glNumberService.setGlNumberContract((glNumber) ? glNumber.id : '', (this.type === 'BLOCK_TIME') ? 'blockTime' : 'serviceContract').subscribe(data => {
        this.selectedGlNumber = new GlNumber(data);
      })
    }
    this.cd.detectChanges();
    console.log("selectedGlNumber",this.selectedGlNumber);
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
     this.onSelectGlNumbers(res);
    })
  }

}
