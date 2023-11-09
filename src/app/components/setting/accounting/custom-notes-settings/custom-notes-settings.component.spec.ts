import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNotesSettingsComponent } from './custom-notes-settings.component';

describe('CustomNotesSettingsComponent', () => {
  let component: CustomNotesSettingsComponent;
  let fixture: ComponentFixture<CustomNotesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomNotesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNotesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
