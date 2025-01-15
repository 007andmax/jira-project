import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavOldComponent } from './nav.component';

describe('NavOldComponent', () => {
  let component: NavOldComponent;
  let fixture: ComponentFixture<NavOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavOldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
