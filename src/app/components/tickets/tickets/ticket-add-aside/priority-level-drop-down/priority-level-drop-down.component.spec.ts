import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityLevelDropDownComponent } from './priority-level-drop-down.component';

describe('PriorityLevelDropDownComponent', () => {
  let component: PriorityLevelDropDownComponent;
  let fixture: ComponentFixture<PriorityLevelDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityLevelDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityLevelDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
