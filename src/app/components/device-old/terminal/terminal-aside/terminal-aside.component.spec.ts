import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalAsideComponent } from './terminal-aside.component';

describe('TerminalAsideComponent', () => {
  let component: TerminalAsideComponent;
  let fixture: ComponentFixture<TerminalAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
