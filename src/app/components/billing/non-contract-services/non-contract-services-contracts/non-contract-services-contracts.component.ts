import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-non-contract-services-contracts',
  templateUrl: './non-contract-services-contracts.component.html',
  styleUrls: ['./non-contract-services-contracts.component.scss']
})
export class NonContractServicesContractsComponent implements OnInit, OnDestroy {
  @ViewChild('glNumberSelect') glNumberSelect: DropDownComponent;
  @Input() type: string = '';
  glNumbers: Array<GlNumber> = [];
  selectedGlNumber: GlNumber = null;
  sub: Subscription = new Subscription();
  constructor(private glNumberStateService: GlNumberStateService,
    public cd: ChangeDetectorRef,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      this.selectedGlNumber = this.glNumbers.find(item => (this.type === 'BLOCK_TIME') ? item.blockTime : item.serviceContract);
    })
    this.sub.add(getOnGlNumbers);
    this.selectedGlNumber = this.glNumbers.find(item => (this.type === 'BLOCK_TIME') ? item.blockTime : item.serviceContract);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onSelectGlNumbers(glNumber) {
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
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.onSelectGlNumbers(res);
    })
  }

  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
