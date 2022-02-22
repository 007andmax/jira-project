import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowUpdatesComponent } from './window-updates.component';

describe('WindowUpdatesComponent', () => {
  let component: WindowUpdatesComponent;
  let fixture: ComponentFixture<WindowUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
