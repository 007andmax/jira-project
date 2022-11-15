import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloaderTicketComponent } from './preloader-ticket.component';

describe('PreloaderTicketComponent', () => {
  let component: PreloaderTicketComponent;
  let fixture: ComponentFixture<PreloaderTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloaderTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloaderTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
