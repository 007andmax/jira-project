import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAgentComponent } from './download-agent.component';

describe('DownloadAgentComponent', () => {
  let component: DownloadAgentComponent;
  let fixture: ComponentFixture<DownloadAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
