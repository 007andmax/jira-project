import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturesDropDownComponent } from './manufactures-drop-down.component';

describe('ManufacturesDropDownComponent', () => {
  let component: ManufacturesDropDownComponent;
  let fixture: ComponentFixture<ManufacturesDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturesDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturesDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
