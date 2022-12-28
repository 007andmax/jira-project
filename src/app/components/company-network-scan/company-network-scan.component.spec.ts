import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNetworkScanComponent } from './company-network-scan.component';

describe('CompanyNetworkScanOldComponent', () => {
  let component: CompanyNetworkScanOldComponent;
  let fixture: ComponentFixture<CompanyNetworkScanOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyNetworkScanOldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNetworkScanOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
