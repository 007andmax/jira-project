import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class EmailTempleteService {
  private apiUrl = environment.apiUrl;
  private ticketTemplates = {
    TICKET_CREATED: {
      title: "A new Ticket is created",
      recipient: "User",
      description:
        "This message will confirm the ticket details that client user conveyed to the agent for creating the ticket.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    },
    TICKET_CLOSED: {
      title: "A Ticket is closed",
      recipient: "User",
      description:
        "This message will be sent to inform client user that ticket has been closed.",
      requiredKeywords: ["$Ticket_Number"],
      requiredKeywordsRegExp: /\$Ticket_Number/,
      showPreview: true
    },
    TU_ADDED: {
      title: "A new Ticket Update is added",
      recipient: "All persons added to Ticket Update",
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
      title: "An Invoice is sent",
      recipient: "Company’s First Primary Contact",
      description:
        "This message will be sent when an invoice is created and sent.",
      showPreview: true
    },
    COMPANY_INV_RESENT: {
      title: "An Invoice is re-sent",
      recipient: "Company’s First Primary Contact",
      description: "This message will be sent when an invoice is re-sent.",
      showPreview: true
    },
    COMPANY_PAYMENT_RECEIVED: {
      title: "A payment is received",
      recipient: "Company’s First Primary Contact",
      description:
        "This message will be sent to acknowledge the payment made against the invoices sent to company.",
      showPreview: true
    }
  };

  constructor(private http: HttpClient) { }

  /**
   * ticket templates
   */
  getTicketTemplates() {
    return this.ticketTemplates;
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
    );
  }

  /**
   * set default template
   * @param type 
   */
  setToDefaultTemplete(type) {
    return this.http.post(
      `${this.apiUrl}settings/emailPages/toDefaultTemplate/${type}`,
      {}
    );
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}


