import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { AppStateService } from "src/app/states/app/app-state.service";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EmailTempleteService {
  private apiUrl = environment.apiUrl;
  private ticketTemplates = {
    TICKET_CREATED: {
      title: "New Ticket is created",
      recipient: "User",
      description:
        "This message will confirm the ticket details that client user conveyed to the agent for creating the ticket.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    },
    TICKET_CLOSED: {
      title: "Ticket is closed",
      recipient: "User",
      description:
        "This message will be sent to inform client user that ticket has been closed.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    },
    TU_ADDED: {
      title: "Ticket Update is added",
      recipient: "All persons added to Ticket Update",
      description:
        "This message will be sent when a person is added to the Ticket Update.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    },
    TICKET_OPENED: {
      title: "Ticket is opened",
      recipient: "Tech / Customer Users",
      description:
        "This message will be sent when a person is added to the Ticket Update.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    },
    TU_DELETED: {
      title: "Ticket update is delted",
      recipient: "Tech / Customer Users",
      description:
        "This message will be sent when a person is added to the Ticket Update.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    }
  };

  private agentTemplates = {
    DOWNLOAD_AGENT: {
      title: "Agent Download",
      recipient: "Client User",
      description:
        "This message will be sent to client user with agent download link.",
      showPreview: true
    }
  };

  private invoiceTemplates = {
    COMPANY_INV_SENT: {
      title: "Invoice is sent",
      recipient: "Company’s First Primary Contact",
      description:
        "This message will be sent when an invoice is created and sent.",
      showPreview: true
    },
    COMPANY_INV_RESENT: {
      title: "Invoice is re-sent",
      recipient: "Company’s First Primary Contact",
      description: "This message will be sent when an invoice is re-sent.",
      showPreview: true
    },
    COMPANY_PAYMENT_RECEIVED: {
      title: "Payment is received",
      recipient: "Company’s First Primary Contact",
      description:
        "This message will be sent to acknowledge the payment made against the invoices sent to company.",
      showPreview: true
    },
    COMPANY_PAYMENT_REFUNDED: {
      title: "Payment is refunded",
      recipient: "Company’s First Primary Contact",
      description:
        "This message will be sent to acknowledge the payment made against the invoices sent to company.",
      showPreview: true
    }
  };

  private userTemplates = {
    USER_CREATED: {
      title: "New Customer user is created",
      recipient: "New customer user",
      showPreview: true
    },
  };

  private quoteTemplates = {
    SALE_QUOTE_CREATED: {
      title: "New Quote is created",
      recipient: "Tech / Customer Users",
      showPreview: true
    },
    SALE_QUOTE_APPROVED: {
      title: "Quote is approved",
      recipient: "Tech / Customer Users",
      showPreview: true
    },
    SALE_QUOTE_REFUSED: {
      title: "Quote is refused",
      recipient: "Tech / Customer Users",
      showPreview: true
    },
  };

  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }

  /**
   * ticket templates
   */
  getTicketTemplates() {
    return this.ticketTemplates;
  }

  /**
  * quote templates
  */
  getQuoteTemplates() {
    return this.quoteTemplates;
  }

  /**
   * get agent templates
   */
  getAgentTemplates() {
    return this.agentTemplates;
  }

  /**
   * get invoice templates
   */
  getInvoiceTemplates() {
    return this.invoiceTemplates;
  }

  /**
   * get user templates
   */
  getUserTemplates() {
    return this.userTemplates;
  }

  /**
   * email pages
   */
  getEmailPages() {
    return this.http.get(`${this.apiUrl}settings/emailPages/`);
  }

  /**
   * template based params
   * @param type 
   */
  getTemplate(type: string) {
    return this.http.get(`${this.apiUrl}settings/emailPages/byType/${type}`);
  }

  /**
   * 
   * @param type 
   * @param data 
   */
  getHtmlForPreview(type: string, data) {
    return this.http.post(`${this.apiUrl}settings/emailPages/preview/${type}`, {
      subject: data.subject, body: data.body
    }, { responseType: 'text' });
  }

  /**
   * saved email template
   * @param data 
   * @param type 
   */
  saveEmailTemplate(data, type: string) {
    return this.http.put(
      `${this.apiUrl}settings/emailPages/updateTemplate/${type}`,
      data
    ).pipe(
      tap(data => {
        this.toastrService.success("Saved Successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  /**
   * set default template
   * @param type 
   */
  setToDefaultTemplete(type) {
    return this.http.post(
      `${this.apiUrl}settings/emailPages/toDefaultTemplate/${type}`,
      {}
    ).pipe(
      tap(data => {
        this.toastrService.success("Restored Successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}


