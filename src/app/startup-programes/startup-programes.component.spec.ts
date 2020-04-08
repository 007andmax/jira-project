import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupProgramesComponent } from './startup-programes.component';

describe('StartupProgramesComponent', () => {
  let component: StartupProgramesComponent;
  let fixture: ComponentFixture<StartupProgramesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartupProgramesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartupProgramesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
