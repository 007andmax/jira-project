import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CannedResponsesAsideComponent } from './canned-responses-aside.component';

describe('CannedResponsesAsideComponent', () => {
  let component: CannedResponsesAsideComponent;
  let fixture: ComponentFixture<CannedResponsesAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CannedResponsesAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CannedResponsesAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
