import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNetworkScanItemTooltipComponent } from './company-network-scan-item-tooltip.component';

describe('CompanyNetworkScanItemTooltipComponent', () => {
  let component: CompanyNetworkScanItemTooltipComponent;
  let fixture: ComponentFixture<CompanyNetworkScanItemTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNetworkScanItemTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNetworkScanItemTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
