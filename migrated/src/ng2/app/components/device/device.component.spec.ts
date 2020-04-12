import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceComponent } from './device.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        DeviceComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DeviceComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'quck-device'`, () => {
    const fixture = TestBed.createComponent(DeviceComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('quck-device');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(DeviceComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to quck-device!');
  });
});
