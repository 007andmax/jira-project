import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomNotesSettingsComponent } from './edit-custom-notes-settings.component';

describe('EditCustomNotesSettingsComponent', () => {
  let component: EditCustomNotesSettingsComponent;
  let fixture: ComponentFixture<EditCustomNotesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomNotesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomNotesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
