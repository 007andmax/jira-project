import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgentLinkComponent } from './modal-agent-link.component';

describe('ModalAgentLinkComponent', () => {
  let component: ModalAgentLinkComponent;
  let fixture: ComponentFixture<ModalAgentLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAgentLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
