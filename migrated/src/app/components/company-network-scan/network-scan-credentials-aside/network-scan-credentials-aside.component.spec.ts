import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkScanCredentialsAsideComponent } from './network-scan-credentials-aside.component';

describe('NetworkScanCredentialsAsideComponent', () => {
  let component: NetworkScanCredentialsAsideComponent;
  let fixture: ComponentFixture<NetworkScanCredentialsAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkScanCredentialsAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkScanCredentialsAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
