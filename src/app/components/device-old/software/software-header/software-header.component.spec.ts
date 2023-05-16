import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareHeaderComponent } from './software-header.component';

describe('SoftwareHeaderComponent', () => {
  let component: SoftwareHeaderComponent;
  let fixture: ComponentFixture<SoftwareHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
