import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomNotesSettingsComponent } from './add-custom-notes-settings.component';

describe('AddCustomNotesSettingsComponent', () => {
  let component: AddCustomNotesSettingsComponent;
  let fixture: ComponentFixture<AddCustomNotesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomNotesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomNotesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
