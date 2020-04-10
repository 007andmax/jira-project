import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelTicketsComponent } from './left-panel-tickets.component';

describe('LeftPanelTicketsComponent', () => {
  let component: LeftPanelTicketsComponent;
  let fixture: ComponentFixture<LeftPanelTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
