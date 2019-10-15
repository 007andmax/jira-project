import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/ng2/environments/environment";

@Injectable({
  providedIn: "root"
})
export class EmailTempleteService {
  private apiUrl = environment.apiUrl;
  private ticketTemplates = {
    //'TU_EDITED': {
    //  title: 'A Ticket Update is edited',
    //  recipient: 'All persons added to Ticket Update',
    //  description: 'This message will be sent when a ticket update is edited.',
    //  requiredKeywords: ['$Ticket_Number'],
    //  requiredKeywordsRegExp: /\$Ticket_Number/
    //},
    //'TU_DELETED': {
    //  title: 'A Ticket Update is deleted',
    //  recipient: 'All persons added to Ticket Update',
    //  description: 'This message will be sent when a ticket update is deleted.',
    //  requiredKeywords: ['$Ticket_Number'],
    //  requiredKeywordsRegExp: /\$Ticket_Number/
    //},
    //'TICKET_ASSIGNED': {
    //  title: 'A Ticket is assigned/re-assigned',
    //  recipient: 'User',
    //  description: 'This message will inform the client user about the ticket assignee. It may include the assignee contact details.',
    //  requiredKeywords: ['$Ticket_Number'],
    //  requiredKeywordsRegExp: /\$Ticket_Number/
    //},
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
    //'TICKET_OPENED': {
    //  title: 'A Ticket is marked as Open',
    //  recipient: 'User',
    //  description: 'This message will be sent when a previously closed ticket is marked as open.',
    //  requiredKeywords: ['$Ticket_Number'],
    //  requiredKeywordsRegExp: /\$Ticket_Number/
    //},
    //'TICKET_SPAM': {
    //  title: 'A Ticket is marked/reported as Spam',
    //  recipient: 'User',
    //  description: 'This message will be sent when a ticket is marked/reported as spam.',
    //  requiredKeywords: ['$Ticket_Number'],
    //  requiredKeywordsRegExp: /\$Ticket_Number/
    //},
    //'TICKET_TRASH': {
    //  title: 'A Ticket is moved to Trash',
    //  recipient: 'User',
    //  description: 'This message will be sent when a ticket is moved to trash.',
    //  requiredKeywords: ['$Ticket_Number'],
    //  requiredKeywordsRegExp: /\$Ticket_Number/
    //}
  };

  private agentTemplates = {
    DOWNLOAD_AGENT: {
      title: "Agent Download",
      recipient: "Client User",
      description:
        "This message will be sent to client user with agent download link.",
      showPreview: true
    }
    //'AGENT_CREATED': {
    //  title: "A new Agent is created",
    //  recipient: "New Agent",
    //  description: "This message will be sent to greet the new agent. It may also include a link to verify the agent's email address."
    //},
    //'AGENT_ARCHIVED': {
    //  title: "An Agent is archived",
    //  recipient: "Agent",
    //  description: "This message will be sent when the agent is archived."
    //},
    //'AGENT_CONTACT_MODIFIED': {
    //  title: "Agent's contact information is modified",
    //  recipient: "Agent",
    //  description: "This message will be sent when the agent’s contact information is modified."
    //},
    //'AGENT_TICKET_RESTORE': {
    //  title: "A Ticket is restored to its original folder from either Spam or Trash",
    //  recipient: "Agent",
    //  description: "This message will be sent when a ticket is restored from either Spam or Trash to its original folder."
    //},
    //'AGENT_ROLE_UPGRADED': {
    //  title: "Agent's privilege is upgraded to either Administrator or Super Admin",
    //  recipient: "Agent",
    //  description: "This message will be sent when agent’s user access privileges are upgraded."
    //},
    //'AGENT_ROLE_DOWNGRADED': {
    //  title: "Agent's privilege is downgraded to either Administrator or User",
    //  recipient: "Agent",
    //  description: "This message will be sent when agent’s access privileges are downgraded."
    //}
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
    // 'COMPANY_OVERDUE_INV_SENT': {
    //   title: "An Overdue Invoice is sent",
    //   recipient: "Company’s First Primary Contact",
    //   description: "This message will be sent when an overdue invoice is re-sent.",
    //   showPreview: true
    // },
    COMPANY_PAYMENT_RECEIVED: {
      title: "A payment is received",
      recipient: "Company’s First Primary Contact",
      description:
        "This message will be sent to acknowledge the payment made against the invoices sent to company.",
      showPreview: true
    }
  };

  constructor(private http: HttpClient) {}

  getTicketTemplates() {
    return this.ticketTemplates;
  }

  getAgentTemplates() {
    return this.agentTemplates;
  }

  getInvoiceTemplates() {
    return this.invoiceTemplates;
  }

  getEmailPages() {
      return this.http.get(`${this.apiUrl}settings/emailPages/`);
  }

  getTemplate(type: string) {
    return this.http.get(`${this.apiUrl}settings/emailPages/byType/${type}`);
  }

  getHtmlForPreview(type: string, data) {
    return this.http.post(`${this.apiUrl}settings/emailPages/byType/${type}`, {
      data
    });
  }

  saveEmailTemplate(data, type: string) {
    return this.http.put(
      `${this.apiUrl}settings/emailPages/updateTemplate/${type}`,
      data
    );
  }

  setToDefaultTemplete(type){
    return this.http.post(
      `${this.apiUrl}settings/emailPages/toDefaultTemplate/${type}`,
      {}
    );
  }
}
