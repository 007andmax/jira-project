import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDatepickerComponent } from './multi-datepicker.component';

describe('MultiDatepickerComponent', () => {
  let component: MultiDatepickerComponent;
  let fixture: ComponentFixture<MultiDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
