import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelSettingsComponent } from './left-panel-settings.component';

describe('LeftPanelSettingsComponent', () => {
  let component: LeftPanelSettingsComponent;
  let fixture: ComponentFixture<LeftPanelSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
