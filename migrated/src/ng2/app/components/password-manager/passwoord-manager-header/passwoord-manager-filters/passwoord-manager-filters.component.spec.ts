import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswoordManagerFiltersComponent } from './passwoord-manager-filters.component';

describe('PasswoordManagerFiltersComponent', () => {
  let component: PasswoordManagerFiltersComponent;
  let fixture: ComponentFixture<PasswoordManagerFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswoordManagerFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswoordManagerFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
