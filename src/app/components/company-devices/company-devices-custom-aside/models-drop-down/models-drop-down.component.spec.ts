import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsDropDownComponent } from './models-drop-down.component';

describe('ModelsDropDownComponent', () => {
  let component: ModelsDropDownComponent;
  let fixture: ComponentFixture<ModelsDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelsDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
