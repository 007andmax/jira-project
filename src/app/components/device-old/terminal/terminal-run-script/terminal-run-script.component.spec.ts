import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalRunScriptComponent } from './terminal-run-script.component';

describe('TerminalRunScriptComponent', () => {
  let component: TerminalRunScriptComponent;
  let fixture: ComponentFixture<TerminalRunScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalRunScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalRunScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
