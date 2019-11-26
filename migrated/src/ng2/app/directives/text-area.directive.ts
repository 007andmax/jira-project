import { Directive, OnInit, ElementRef, Injectable, Input, ChangeDetectorRef, OnChanges, SimpleChanges, AfterContentChecked, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appTextArea]'
})
@Injectable()
export class TextAreaDirective implements OnInit {

  cloned: HTMLTextAreaElement;
  lines: number = 1;
  height: number = 0;
  @Input() limit;
  @Input() minHeight;
  @Output() onPast = new EventEmitter<any>();
  block: boolean = false;
  ctrlDown: boolean = false;
  keyCode = null;
  constructor(private element: ElementRef, public cd: ChangeDetectorRef) {

  }
  ngOnInit() {

    this.onInitCLine();
    this.element.nativeElement.parentNode.style.position = 'relative';
    this.element.nativeElement.addEventListener('keydown', this.limitLines);
    this.element.nativeElement.addEventListener('keyup', this.setNumberOfLines);
    this.element.nativeElement.addEventListener('cut', this.setNumberOfLines);
    this.element.nativeElement.addEventListener('paste', this.limitPaste);
    this.element.nativeElement.addEventListener('input', this.onUpdate);
   

    if (this.limit) this.onInitLimit();

    //   this.onCheckReset();


  }
  ngDoCheck() {
    if (this.block) return;
    if (this.element.nativeElement.value.length > 0) this.block = true;
    this.onUpdate();// remove
  }

  private onInitLimit() {
    this.element.nativeElement.style.overflow = 'hidden';
    this.cloned.style.overflow = 'hidden';
    this.cloned.style.position = 'absolute';
    this.cloned.style.width = this.element.nativeElement.clientWidth + 'px';
  }
  private update() {

    this.element.nativeElement.style.height = "auto";
    this.height = this.element.nativeElement.scrollHeight;
    if (this.height > 0) {

      if (this.limit && this.height >= this.limit) {
        this.element.nativeElement.style.height = this.limit + 'px';
      } else {

        if (this.element.nativeElement.value.length === 0 && this.minHeight) {
          this.element.nativeElement.style.height = this.minHeight + "px";
        } else {
          this.element.nativeElement.style.height = this.height + "px";
        }

      }

    }
  }
  private onInitCLine() {
    this.cloned = this.element.nativeElement.cloneNode(true);
    this.cloned.style.opacity = '0';
    this.cloned.style.zIndex = '1000';
    this.cloned.style.height = '0px';
    this.element.nativeElement.parentNode.appendChild(this.cloned);

  }
  private onUpdate = () => {

    this.update();

    // this.cloned.innerHTML = this.element.nativeElement.value;
  }
  private getKeyNum(e) {
    let keynum;
    // IE
    if (window.event) {
      keynum = e.keyCode;
      // Netscape/Firefox/Opera
    } else if (e.which) {
      keynum = e.which;
    }

    return keynum;
  }
  private limitLines = (e) => {
    let keynum = this.getKeyNum(e);
    this.keyCode = keynum;
    if (this.keyCode === 86 && this.ctrlDown) return;
    if (this.keyCode === 17) this.ctrlDown = true;
    let evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
      this.element.nativeElement.value = this.checkForOverflow(this.element.nativeElement.value);

      this.element.nativeElement.blur();
      this.element.nativeElement.focus();
      this.element.nativeElement.click();
      this.cd.detectChanges();
      //   scope.$digest()
    }


    if (keynum === 13) {
      if (this.element.nativeElement.scrollHeight >= +this.limit) {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    if (keynum !== 8) {
      let value = e.target.value.slice(0, e.srcElement.selectionStart) + String.fromCharCode(keynum) + e.target.value.slice(e.srcElement.selectionStart);
      // value.splice(e.srcElement.selectionStart, 0, String.fromCharCode(keynum))
      this.cloned.innerHTML = value;
      if (this.cloned.scrollHeight > +this.limit) {
        e.stopPropagation();
        e.preventDefault();

        this.cloned.innerHTML = this.element.nativeElement.value;
      }
    }


  };
  private setNumberOfLines = (e) => {
    let keynum = this.getKeyNum(e);
     
    if (this.keyCode === 17) this.ctrlDown = false;
    this.lines = this.getNumberOfLines(this.element.nativeElement.value);
  };
  private limitPaste = (e) => {
    
    let clipboardData, pastedData, newValue, isOverflowed;
    // Stop data actually being pasted into div
    
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || (<any>window).clipboardData;
    pastedData = clipboardData.getData('Text');
 

    newValue = (this.element.nativeElement.value || '').slice(0, e.srcElement.selectionStart) + pastedData + (this.element.nativeElement.value || '').slice(e.srcElement.selectionStart);
    this.cloned.innerHTML = newValue
    isOverflowed = this.cloned.scrollHeight > +this.limit
    let copiedValue = newValue;
   
  if (this.keyCode !== 86 && this.ctrlDown !== false || e.srcElement.selectionStart === e.srcElement.selectionEnd) {
  
    this.element.nativeElement.value = this.checkForOverflow(copiedValue);
  } else {
    this.cloned.innerHTML = pastedData
    this.element.nativeElement.value = pastedData;
    
  }
    this.element.nativeElement.blur();
    this.element.nativeElement.focus();
    this.element.nativeElement.click();
    this.cd.detectChanges();
   
    this.onPast.emit(this.element.nativeElement.value);
    //scope.$digest()
  };

  private checkForOverflow(value) {
    let isOverflowed = this.cloned.scrollHeight > +this.limit;

    while (isOverflowed) {
      value = value.slice(0, -1);
      this.cloned.innerHTML = value;
      isOverflowed = this.cloned.scrollHeight > +this.limit;
    }

    return value;
  }
  private getNumberOfLines(str) {
    if (str) {
      return str.split(/\r\n|\r|\n/).length;
    }

    return 1;
  }
  //attr.$set("ngTrim", "false");



}
