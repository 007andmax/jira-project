import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswoordManagerHeaderComponent } from './passwoord-manager-header.component';

describe('PasswoordManagerHeaderComponent', () => {
  let component: PasswoordManagerHeaderComponent;
  let fixture: ComponentFixture<PasswoordManagerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswoordManagerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswoordManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
