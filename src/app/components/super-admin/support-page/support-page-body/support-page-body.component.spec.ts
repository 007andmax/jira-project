import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageBodyComponent } from './support-page-body.component';

describe('SupportPageBodyComponent', () => {
  let component: SupportPageBodyComponent;
  let fixture: ComponentFixture<SupportPageBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
