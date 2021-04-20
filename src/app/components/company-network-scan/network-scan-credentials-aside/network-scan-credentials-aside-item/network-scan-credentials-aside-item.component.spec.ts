import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkScanCredentialsAsideItemComponent } from './network-scan-credentials-aside-item.component';

describe('NetworkScanCredentialsAsideItemComponent', () => {
  let component: NetworkScanCredentialsAsideItemComponent;
  let fixture: ComponentFixture<NetworkScanCredentialsAsideItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkScanCredentialsAsideItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkScanCredentialsAsideItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
