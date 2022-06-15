import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAuthenticatorScratchesComponent } from './google-authenticator-scratches.component';

describe('GoogleAuthenticatorScratchesComponent', () => {
  let component: GoogleAuthenticatorScratchesComponent;
  let fixture: ComponentFixture<GoogleAuthenticatorScratchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleAuthenticatorScratchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAuthenticatorScratchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
