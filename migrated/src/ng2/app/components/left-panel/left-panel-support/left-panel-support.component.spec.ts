import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelSupportComponent } from './left-panel-support.component';

describe('LeftPanelSupportComponent', () => {
  let component: LeftPanelSupportComponent;
  let fixture: ComponentFixture<LeftPanelSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
