import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkScanCredentialsAddComponent } from './network-scan-credentials-add.component';

describe('NetworkScanCredentialsAddComponent', () => {
  let component: NetworkScanCredentialsAddComponent;
  let fixture: ComponentFixture<NetworkScanCredentialsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkScanCredentialsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkScanCredentialsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
