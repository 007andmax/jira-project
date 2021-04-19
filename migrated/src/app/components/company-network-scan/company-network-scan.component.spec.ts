import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNetworkScanComponent } from './company-network-scan.component';

describe('CompanyNetworkScanComponent', () => {
  let component: CompanyNetworkScanComponent;
  let fixture: ComponentFixture<CompanyNetworkScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNetworkScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNetworkScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
