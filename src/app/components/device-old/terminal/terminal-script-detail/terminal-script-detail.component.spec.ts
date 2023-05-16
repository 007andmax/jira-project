import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalScriptDetailComponent } from './terminal-script-detail.component';

describe('TerminalScriptDetailComponent', () => {
  let component: TerminalScriptDetailComponent;
  let fixture: ComponentFixture<TerminalScriptDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalScriptDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalScriptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
