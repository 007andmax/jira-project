import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropDownComponent } from './drop-down.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from '../mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('DropDownComponent unit test', () => {
  let component: DropDownComponent;
  let fixture: ComponentFixture<DropDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [DropDownComponent
      ],
    }).compileComponents();

  });

  it('check "reset"', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.reset(["1", "2", "3"]);
    expect(com.list).toEqual(["1", "2", "3"]);
    expect(com.reqList).toEqual(["1", "2", "3"]);
  });
  it('check "reset" with sort', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.sort = true;
    com.reset(["3", "2", "1"]);
    expect(com.list).toEqual(["1", "2", "3"]);
    expect(com.reqList).toEqual(["1", "2", "3"]);
  });
  it('check "onCheckAdd", search = true, add = true', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.search = true;
    com.add = true;
    com.reset(["1", "2", "3"]);
    com.onCheckAdd({ target: { value: "4" } });
    expect(com.isAdd).toEqual(true);
  });
  it('check "addNewItem",sort = true', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.reset(["3", "2", "1"]);
    com.addNewItem("4")
    expect(com.reqList).toEqual(["1", "2", "3", "4"]);
  });
  it('check "addItem"', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    const comElement: any = fixture.nativeElement;
    comElement.querySelector("#dropdown1").value = "test";
    com.reset(["3", "2", "1"]);
    expect(com.reqList).toEqual(com.list);
    expect(com.isAdd).toEqual(false);

  });
  it('check "selectItemWithOutChanges"', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectItemWithOutChanges("test");
    expect(com.selectedItem).toEqual("test");
  });
  it('check "onSelect"', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelect("test");
    expect(com.selectedItem).toEqual("test");
  });
  it('check "clearWithOutChanges"', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    const comElement: any = fixture.nativeElement;
    com.clearWithOutChanges();
    expect(com.isAdd).toEqual(false);
    expect(com.selectedItem).toEqual(null);
    expect(comElement.querySelector("#dropdown1").value).toEqual("");
  });
  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(DropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedItem = "test";
    com.isSelected("test");
    expect(com.isSelected("test")).toEqual(true);
  });
});

describe('DropDownComponent integration test', () => {
  let component: DropDownComponent;
  let fixture: ComponentFixture<DropDownComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [DropDownComponent
      ],
    })
    fixture = TestBed.createComponent(DropDownComponent);
    component = fixture.componentInstance;
  });

  it('should contain "title" property', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    component.title = "test";
    fixture.detectChanges();
    expect(bannerElement.querySelector(".qt-input-block__label").textContent).toContain('test');
  });
  it('should contain "widthInput" property', () => {
    const bannerElement: any = fixture.nativeElement;
    component.widthInput = "33%";
    component.class = ['test'];
    fixture.detectChanges();
    expect(bannerElement.querySelector(".test").style.width).toContain('33%');
  });
});
