import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageInfoComponent } from './support-page-info.component';

describe('SupportPageInfoComponent', () => {
  let component: SupportPageInfoComponent;
  let fixture: ComponentFixture<SupportPageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
