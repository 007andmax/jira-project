import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNetworkScanItemComponent } from './company-network-scan-item.component';

describe('CompanyNetworkScanItemComponent', () => {
  let component: CompanyNetworkScanItemComponent;
  let fixture: ComponentFixture<CompanyNetworkScanItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNetworkScanItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNetworkScanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
