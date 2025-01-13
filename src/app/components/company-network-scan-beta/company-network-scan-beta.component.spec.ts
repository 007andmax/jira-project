import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNetworkScanBetaComponent } from './company-network-scan-beta.component';

describe('CompanyNetworkScanBetaComponent', () => {
  let component: CompanyNetworkScanBetaComponent;
  let fixture: ComponentFixture<CompanyNetworkScanBetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyNetworkScanBetaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNetworkScanBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
