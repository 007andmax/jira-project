
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, TemplateRef } from "@angular/core";
import { EmailTempleteService } from "../../../services/email-template/email-template.service";
import { map, catchError } from "rxjs/operators";
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { of, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { EmailTemplateStateService } from "src/app/states/email-template/email-template-state.service";
import { fadeInAnimation } from "src/app/animations";
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor";
import { ConfirmStateService } from "../../shared/confirm/services/confirm-state.service";
import { RESTORE_DEFAULT } from "src/app/const/confirm";
import { ConfirmComponent } from "../../shared/confirm/confirm.component";
import { DynamicTooltipComponent } from '../../shared/dynamic-tooltip/dynamic-tooltip.component';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { EmailTemplateRoutingModule } from './email-template-routing.module';

declare var $: any;

@Component({
  standalone: true,
  imports: [CommonModule,
    NgbModule,
    ReactiveFormsModule,
    EmailTemplateRoutingModule,
    AngularEditorModule,
    EmailTempleteComponent,
    SanitizeHtmlPipe],
  selector: "app-email-template",
  templateUrl: "./email-template.component.html",
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ["./email-template.component.scss"],

})
export class EmailTempleteComponent implements OnInit, OnDestroy {
  loading = true;
  submitted = false;
  edit = false;
  ticketTemplates: any;
  agentTemplates: any;
  invoiceTemplates: any;
  userTemplates: any;
  currentOpenTemplate = "";
  keywords: any[];
  templeteInfo: any;
  emailPreviewHtml: any;
  gettingEmailTemplatePreview: boolean;
  type = '';
  emailPages: any;
  elEditor: any = "";
  templeteForm: UntypedFormGroup;
  openEmailTemplate: string;
  public show = false;
  public buttonName: any = "Show Description";
  templatesData = { subject: {}, body: {}, isActive: false, header: {}, isHeaderEnabled: false };
  selectedInput: string;
  @ViewChild("body", { static: false }) body: ElementRef;
  @ViewChild("subject", { static: false }) subject: ElementRef;
  @ViewChild("header", { static: false }) header: ElementRef;
  sub: Subscription = new Subscription();
  @ViewChild('editorWrap', { static: false }) editorWrap!: ElementRef<HTMLElement>;
  templeteKey: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '100%',
    minHeight: '5rem',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write your draft for companies',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarPosition: 'bottom',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
  };
  constructor(
    private modalService: NgbModal,
    private emailService: EmailTempleteService,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private settingStateService: SettingStateService,
    private emailTemplateStateService: EmailTemplateStateService,
    private sanitized: DomSanitizer,
    private elRef: ElementRef,
    private confirmStateService: ConfirmStateService,
  ) {
    this.ticketTemplates = this.emailService.getTicketTemplates();
    this.agentTemplates = this.emailService.getAgentTemplates();
    this.invoiceTemplates = this.emailService.getInvoiceTemplates();
    this.userTemplates = this.emailService.getUserTemplates();
  }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.keywords = [];
    this.templeteForm = this.formBuilder.group({
      subject: ["", Validators.required],
      header: [""],
      body: [""],
      isActive: [false],
      isHeaderEnabled: [false]
    });
    this.getEmailPages();
    this.settingStateService.setComponentName('EmailTempleteComponent');
    let onChangeEmailTemplates = this.emailTemplateStateService.onChangeEmailTemplates.subscribe(data => {
      if (data.action == "COMPANY_EMAIL_NOTIFICATION") {
        for (const key in this.ticketTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
        for (const key in this.agentTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
        for (const key in this.invoiceTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
        for (const key in this.userTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
      }
    })
    this.sub.add(onChangeEmailTemplates);

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === RESTORE_DEFAULT) this.onRestoreDefault();
      }
    })
    this.sub.add(getConfirm);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
  }

  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.templeteForm.controls;
  }

  onReady(eventData) {
    eventData.plugins.get("FileRepository").createUploadAdapter = function (
      loader
    ) {
      return new UploadAdapter(loader);
    };
  }

  public trackByIndex(index, item) {
    return index;
  }

  /**
   * email pages
   */
  getEmailPages() {
    this.loading = true;
    this.emailService
      .getEmailPages()
      .pipe(
        map(res => {
          this.loading = false;
          this.emailPages = res;
        }),
        catchError(err => {
          this.loading = false;
          return of("");
        })
      )
      .subscribe();
  }

  /**
   * get templates
   * @param templete
   * @param index
   */
  getTemplate(templete, key) {
    if (!templete) {
      return;
    }
    this.templeteInfo = { ...templete, key: key };
    this.edit = true;
    this.emailService
      .getTemplate(key)
      .pipe(
        map((res: any) => {
          if (res) {
            this.hideButtonTextEditor();
            this.templatesData.body = res.body;
            this.templatesData.subject = res.subject;
            this.templatesData.header = res.header;
            this.templatesData.isHeaderEnabled = res.isHeaderEnabled;
            this.keywords = res.keywords;
            this.type = res.type

            this.templeteForm.controls["subject"].clearValidators();
            if (this.templeteInfo.requiredKeywordsRegExp) {
              const pattern = this.templeteInfo.requiredKeywordsRegExp;
              this.templeteForm.controls["subject"].setValidators([
                Validators.required,
                Validators.pattern(pattern)
              ]);
              this.templeteForm.controls["subject"].updateValueAndValidity();
            } else {
              this.templeteForm.controls["subject"].setValidators([
                Validators.required
              ]);
            }
            this.templeteForm.controls["body"].clearValidators();
            if (this.templeteInfo.requiredBodyKeywordsRegExp) {
              const pattern = this.templeteInfo.requiredBodyKeywordsRegExp;
              this.templeteForm.controls["body"].setValidators([
                Validators.required,
                Validators.pattern(pattern)
              ]);
              this.templeteForm.controls["body"].updateValueAndValidity();
            } else {
              this.templeteForm.controls["body"].setValidators([
                Validators.required
              ]);
            }
            this.templeteForm.patchValue({
              subject: this.templatesData.subject,
              header: this.templatesData.header,
              body: this.templatesData.body,
              isActive: (this.emailPages.activeAndNotDefault[key]) ? this.emailPages.activeAndNotDefault[key].isActive : false,
              isHeaderEnabled: this.templatesData.isHeaderEnabled
            });
          }
          this.openEmailTemplate = key;
        })
      )
      .subscribe();
  }

  trackByTicket(index, item) {
    return item.value.title;
  }

  /**
   * inset caret based on text
   * @param text
   */
  insertAtCaret(text) {
    var el = document.activeElement;
    this.selectedInput = el.id;
    if (el.classList.contains("angular-editor-textarea")) this.selectedInput = "textarea";
    if (el.id === "subject") {
      var startPos = this.subject.nativeElement.selectionStart;

      this.subject.nativeElement.value =
        this.subject.nativeElement.value.substr(
          0,
          this.subject.nativeElement.selectionStart
        ) +
        text +
        this.subject.nativeElement.value.substr(
          this.subject.nativeElement.selectionStart,
          this.subject.nativeElement.value.length
        );

      this.templeteForm.patchValue({
        subject: this.subject.nativeElement.value
      });

      // this.subject.nativeElement.selectionStart = startPos;
      // this.subject.nativeElement.focus();
      //   queueMicrotask(() => this.restoreFocus(this.subject.nativeElement));
      //  $("#elem").selectRange(3);
    } if (el.id === "header") {
      var startPos = this.header.nativeElement.selectionStart;

      this.header.nativeElement.value =
        this.header.nativeElement.value.substr(
          0,
          this.header.nativeElement.selectionStart
        ) +
        text +
        this.header.nativeElement.value.substr(
          this.header.nativeElement.selectionStart,
          this.header.nativeElement.value.length
        );

      this.templeteForm.patchValue({
        header: this.header.nativeElement.value
      });

      //  this.header.nativeElement.selectionStart = startPos;
      //   this.header.nativeElement.focus();
      // $("#elem").selectRange(3);
    } else {
      const wrap = this.editorWrap.nativeElement;
      const editable = wrap.querySelector('.angular-editor-textarea') as HTMLElement | null;
      if (!editable) return;

      // 1) insert at caret
      this.insertTextIntoAngularEditor(editable, text);

      // 2) make angular-editor notice changes
      editable.dispatchEvent(new InputEvent('input', { bubbles: true }));
      editable.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

      // 3) ensure reactive form definitely gets updated
      const htmlNow = editable.innerHTML;
      const ctrl = this.templeteForm.get('body');
      ctrl?.setValue(htmlNow, { emitEvent: true });
      ctrl?.markAsDirty();
      ctrl?.updateValueAndValidity();
    }
  }
  restoreFocus(
  ) {
    if (!this.selectedInput) return;
    let el = this.selectedInput == "subject" ? this.subject.nativeElement : this.selectedInput == "textarea" ? this.elRef.nativeElement.querySelector(".angular-editor-textarea") : this.header.nativeElement;
    // restore focus
    (el as HTMLElement).focus({ preventScroll: true });
  }

  insertTextIntoAngularEditor(editorHost: HTMLElement, text: string) {
    // editorHost should be the contenteditable element (.angular-editor-textarea)
    editorHost.focus();

    const sel = window.getSelection();
    if (!sel) return;

    // If selection is outside editor, move caret to end
    if (sel.rangeCount === 0 || !editorHost.contains(sel.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(editorHost);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }

    const range = sel.getRangeAt(0);

    // Replace current selection (if any) with text, leaving caret after inserted text
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);

    // Move caret to after inserted text node
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * insert data varables based on params
   * @param myField
   * @param myValue
   */
  insertDataVarables(myField, myValue) {
    var sel, range;
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      myField.rango = sel.getRangeAt(0);
      myField.rango.insertNode(document.createTextNode(myValue));
      myField.autofocus = true;

      this.templeteForm.patchValue({
        body: myField.textContent
      });

      return false;
    }
  }

  insertAt(element, text) {
    if (document['selection']) {
      element.focus();
      var sel = document['selection'].createRange();
      sel.text = text;
      element.focus();
    } else if (element.selectionStart || element.selectionStart === 0) {
      var startPos = element.selectionStart;
      var endPos = element.selectionEnd;
      var scrollTop = element.scrollTop;
      element.value = element.value.substring(0, startPos) +
        text + element.value.substring(endPos, element.value.length);
      element.focus();
      element.selectionStart = startPos + text.length;
      element.selectionEnd = startPos + text.length;
      element.scrollTop = scrollTop;
    } else {
      element.value += text;
      element.focus();
    }
  }

  emailPreview(template: TemplateRef<any>) {
    this.emailPreviewHtml = '';
    this.gettingEmailTemplatePreview = true;
    this.emailService
      .getHtmlForPreview(this.type, this.templeteForm.value)
      .pipe(
        map(resp => {
          this.emailPreviewHtml = resp;
          this.emailPreviewHtml = this.emailPreviewHtml.replace(/font-family: Inter, sans-serif;/gi, '')
          this.emailPreviewHtml = this.sanitized.bypassSecurityTrustHtml(this.emailPreviewHtml);
          this.gettingEmailTemplatePreview = false;
          this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', windowClass: "manage-tags email-template-preview", centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {

          }, (reason) => {

          });
        })
      )
      .subscribe();
  }



  /**
   * saved email template
   */
  saveEmailTemplate() {
    this.edit = true;
    this.submitted = true;
    if (this.templeteForm.invalid) {
      return;
    }
    if (this.templeteInfo.requiredKeywordsRegExp) {
      const matches = this.templeteForm.value.subject.match(
        this.templeteInfo.requiredKeywordsRegExp
      );
      if (matches === null) {
      }
    }
    if (this.templeteInfo.requiredBodyKeywordsRegExp) {
      const matches = this.templeteForm.value.body.match(
        this.templeteInfo.requiredBodyKeywordsRegExp
      );
      if (matches === null) {
      }
    }
    this.templeteForm.patchValue({
      body: (this.templeteForm.value.body.length == 0) ? null : this.templeteForm.value.body,
      subject: this.templeteForm.value.subject,
      header: this.templeteForm.value.header,
    });
    this.emailService
      .saveEmailTemplate(this.templeteForm.value, this.openEmailTemplate)
      .subscribe(
        () => {
          this.closeTemplete();
        }
      );
  }
  closeTemplete() {
    this.submitted = false;
    this.edit = false;
    this.templeteForm.reset();
    this.templeteInfo = null;
  }

  /**
   * retore default templated
   * @param templeteKey
   */
  restoreDefault(templeteKey) {
    if (!templeteKey) {
      return;
    }
    this.templeteKey = templeteKey;
    this.confirmStateService.setConfirmAction(RESTORE_DEFAULT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = "Restore Default Template";
    modalRef.componentInstance.message = `Are you sure you want to restore the template to the default? <br>The current template will not be recoverable.`;

  }
  onRestoreDefault() {
    this.emailService
      .setToDefaultTemplete(this.templeteKey)
      .pipe(
        map((defaultTemplate: any) => {
          if (defaultTemplate) {
            this.templeteForm.patchValue({
              subject: defaultTemplate.subject,
              body: defaultTemplate.body,
              header: defaultTemplate.header,
            });
          }
        })
      )
      .subscribe(
        () => {
          this.confirmStateService.initRequest(false);
        },
        error => {
          this.confirmStateService.initRequest(false);
          this.toastr.error(`Error Occured ${error}`);
        }
      );
  }
  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = "Hide Description";
    } else {
      this.buttonName = "Show Description";
    }
  }

  hideButtonTextEditor() {
    $("#toggleEditorMode-myEditor")
      .parent()
      .hide();
    $("#superscript-myEditor").hide();
    $("#subscript-myEditor").hide();
    $("#strikeThrough-myEditor").hide();
    $("#indent-myEditor")
      .parent()
      .hide();
    $("#insertUnorderedList-myEditor")
      .parent()
      .hide();
    $("#heading-myEditor")
      .parent()
      .hide();
    $("#fontSizeSelector-myEditor")
      .parent()
      .hide();
    $("#foregroundColorPicker-myEditor")
      .parent()
      .hide();
    $("#link-myEditor")
      .parent()
      .hide();
  }
}

export class UploadAdapter {
  private loader;
  constructor(loader: any) {
    this.loader = loader;
  }

  readThis(file: File): Promise<any> {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          var myReader = new FileReader();
          myReader.onloadend = e => {
            resolve({ default: myReader.result });
          };

          myReader.readAsDataURL(file);
        })
    );
  }
}
