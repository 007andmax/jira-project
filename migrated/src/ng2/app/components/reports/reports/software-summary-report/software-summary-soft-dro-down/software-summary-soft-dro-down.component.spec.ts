import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareSummarySoftDroDownComponent } from './software-summary-soft-dro-down.component';

describe('SoftwareSummarySoftDroDownComponent', () => {
  let component: SoftwareSummarySoftDroDownComponent;
  let fixture: ComponentFixture<SoftwareSummarySoftDroDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareSummarySoftDroDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareSummarySoftDroDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
