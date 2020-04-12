'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.emailTemplatesCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'EmailSettingsService', '$sce',
      function ($scope, $state, $stateParams, $location, EmailSettingsService, $sce) {

        $scope.numberPattern = /^\d+$/;


        $scope.ticketTemplates = {
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
          'TICKET_CREATED': {
            title: 'A new Ticket is created',
            recipient: 'User',
            description: 'This message will confirm the ticket details that client user conveyed to the agent for creating the ticket.',
            requiredKeywords: ['$Ticket_Number'],
            requiredKeywordsRegExp: /\$Ticket_Number/,
            showPreview: true
          },
          'TICKET_CLOSED': {
            title: 'A Ticket is closed',
            recipient: 'User',
            description: 'This message will be sent to inform client user that ticket has been closed.',
            requiredKeywords: ['$Ticket_Number'],
            requiredKeywordsRegExp: /\$Ticket_Number/,
            showPreview: true
          },
          'TU_ADDED': {
            title: 'A new Ticket Update is added',
            recipient: 'All persons added to Ticket Update',
            description: 'This message will be sent when a person is added to the Ticket Update.',
            requiredKeywords: ['$Ticket_Number'],
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

        $scope.agentTemplates = {
          'DOWNLOAD_AGENT': {
            title: "Agent Download",
            recipient: "Client User",
            description: "This message will be sent to client user with agent download link.",
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

        $scope.usersTemplates = {
          'USER_CREATED': {
            title: "A new user is created",
            recipient: "New User",
            description: "This message will be sent to greet the new user. It may also include a link to verify the client user's email address."
          },
          'USER_CONTACT_INFO_CHANGED': {
            title: "User's contact information is modified",
            recipient: "User",
            description: "This message will be sent when user’s contact information is modified."
          },
          'USER_IS_ARCHIVED': {
            title: "A user is archived",
            recipient: "User",
            description: "This message will be sent when a user is archived."
          },
          'USER_SUBS_TKT': {
            title: "A user is subscribed to Ticket Updates",
            recipient: "Users",
            description: "This message will be sent when a user is subscribed to ticket updates."
          },
          'USER_SUBS_INV': {
            title: "A user is subscribed to Invoice Updates",
            recipient: "Users",
            description: "This message will be sent when a user is subscribed to invoice updates."
          },
          'USER_ROLE_UPGRADED': {
            title: "User's privilege is upgraded to Administrator",
            recipient: "User",
            description: "This message will be sent when user’s access privileges are upgraded."
          },
          'USER_ROLE_DOWNGRADED': {
            title: "User's privilege is downgraded to User",
            recipient: "User",
            description: "This message will be sent when user’s access privileges has been downgraded."
          }
        };

        $scope.companyTemplates = {
          'COMPANY_CREATED': {
            title: "A new company is created",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when a new company is created. It will confirm the company's details, including site/locations, primary contact, tax rate, and agent application log in information."
          },
          'COMPANY_BASIC_INFO': {
            title: "Company’s basic information is modified",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when the company’s basic information is modified."
          },
          'COMPANY_ARCHIVED': {
            title: "A company is archived",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when the company is archived."
          },
          'COMPANY_PRIMARY_CONTACT_ADDED': {
            title: "A new primary contact is added",
            recipient: "Primary Contact",
            description: "This message will be sent to greet the new primary contact. It may also include a link to verify the primary contact email address."
          },
          'COMPANY_PRIMARY_CONTACT_INFO': {
            title: "A primary contact information is modified",
            recipient: "Primary Contact",
            description: "This message will be sent when primary contact information is modified."
          },
          'COMPANY_LOCATION_ADDED': {
            title: "A new site/location is added",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when a new site/location is added."
          },
          'COMPANY_LOCATION_EDITED': {
            title: "A site/location is modified",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when the company site/location is modified."
          },
          'COMPANY_TAX_ADDED': {
            title: "Tax information is added",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when a new tax is added."
          },
          'COMPANY_TAX_EDITED': {
            title: "Tax information is modified",
            recipient: "Company's First Primary Contact",
            description: "This message will be sent when an existing tax rate is modified."
          },
          'COMPANY_AGENT_APP_CREATED': {
            title: "A new agent application is created",
            recipient: "Company Administrators",
            description: "This message will be sent when a new agent ng1 is created. It may contain logon information, including both full username (with domain name if exists) and password."
          },
          'COMPANY_AGENT_APP_LOGIN': {
            title: "Agent application's login information is modified",
            recipient: "Company Administrators",
            description: "This message will be sent when an agent application logon information is modified. It may contain the updated logon information, including both full username (with domain name if exists) and password."
          },
          'COMPANY_AGENT_APP_UPDATED': {
            title: "Agent application is updated to latest available version",
            recipient: "Company Administrators",
            description: "This message will be sent when an agent is update to latest available version."
          },
          'COMPANY_DEVICE_ADDED': {
            title: "A new device is added",
            recipient: "Company Administrators",
            description: "This message will be sent when a new device is added to company’s managed devices list."
          },
          'COMPANY_DEVICE_REMOVED': {
            title: "A device is removed",
            recipient: "Company Administrators",
            description: "This message will be sent when a device is removed from company’s managed devices list."
          }
        };

        $scope.invoiceTemplates = {
          'COMPANY_INV_SENT': {
            title: "An Invoice is sent",
            recipient: "Company’s First Primary Contact",
            description: "This message will be sent when an invoice is created and sent.",
            showPreview: true
          },
          'COMPANY_INV_RESENT': {
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
          'COMPANY_PAYMENT_RECEIVED': {
            title: "A payment is received",
            recipient: "Company’s First Primary Contact",
            description: "This message will be sent to acknowledge the payment made against the invoices sent to company.",
            showPreview: true
          }
        };

        $scope.vendorTemplates = {
          'VENDOR_CREATED': {
            title: "A new vendor is created",
            recipient: "Vendor's First Primary Contact",
            description: "This message will be sent when a new vendor is created. It will confirm the vendor's details, including site/locations, primary contact, payment terms, and billing address information."
          },
          'VENDOR_BASIC_INFO': {
            title: "Vendor’s basic information is modified",
            recipient: "Vendor’s First Primary Contact",
            description: "This message will be sent when the vendor’s basic information is modified."
          },
          'VENDOR_ARCHIVED': {
            title: "A vendor is archived",
            recipient: "Vendor’s First Primary Contact",
            description: "This message will be sent when the vendor is archived."
          },
          'VENDOR_NEW_PRIMARY_CONTACT': {
            title: "A new primary contact is added",
            recipient: "Vendor’s Primary Contact",
            description: "This message will be sent to greet the new vendor’s primary contact. It may also include a link to verify the vendor primary contact email address."
          },
          'VENDOR_PRIMARY_CONTACT_EDITED': {
            title: "Primary contact’s information is modified",
            recipient: "Vendor’s First Primary Contact",
            description: "This message will be sent when vendor primary contact information is modified."
          },
          'VENDOR_LOCATION_ADDED': {
            title: "A new site/location is added",
            recipient: "Vendor's First Primary Contact",
            description: "This message will be sent when a new site/location is added."
          },
          'VENDOR_LOCATION_EDITED': {
            title: "A site/location is modified",
            recipient: "Vendor’s First Primary Contact",
            description: "This message will be sent when the vendor site/location is modified."
          },
          'VENDOR_PRIM_CONTACT_SUBS_TU': {
            title: "Vendor's primary contact is subscribed to Ticket Updates",
            recipient: "Vendor Primary Contact",
            description: "This message will be sent when a vendor primary contact is subscribed to ticket updates."
          }
        };

        $scope.emailSettingPageDto = EmailSettingsService.getEmailSettingPageDto($scope);

        $scope.templatesData = {
          subject: '',
          body: ''
        };

        $scope.openEmailTemplate = function (templatesKey, event) {

          if ($scope.currentOpenTemplate === templatesKey || (event && event.originalEvent.isCloseTemplates)) {
            return;
          } else if (templatesKey === 'CLOSE') {

            if (event) {
              event.originalEvent.isCloseTemplates = true;
            }
            $scope.currentOpenTemplate = '';
            return;
          }

          EmailSettingsService.getTemplate(templatesKey, function (data) {

            $scope.templatesData = {
              subject: data.subject,
              body: data.body
            };

            $scope.keywords = data.keywords;

            $scope.currentOpenTemplate = templatesKey;
          })
        };

        $scope.restoreDefault = function (templatesKey) {

          EmailSettingsService.setToDefaultTemplate(templatesKey, function (defaultTemplate) {
            $scope.templatesData = {
              subject: defaultTemplate.subject,
              body: defaultTemplate.body
            };
          })
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && (form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.emailPreview = function (templateKey) {
          $scope.emailPreviewHtml = undefined;
          $scope.gettingEmailTemplatePreview = true;
          EmailSettingsService.getHtmlForPreview($scope.templatesData, templateKey, function (resp) {
            $scope.emailPreviewHtml = $sce.trustAsHtml(resp);
            $scope.gettingEmailTemplatePreview = false;
          })
        };

        $scope.saveEmailTemplate = function (templateKey, form) {
          if (form.$valid) {
            $scope.savingInProcess = true;
            $scope.triedToSave = false;

            EmailSettingsService.saveEmailTemplate($scope.templatesData, templateKey, function () {
              $scope.openEmailTemplate('CLOSE');
              form.$setPristine();
              $scope.savingInProcess = false;
            })
          } else {
            $scope.triedToSave = true;
          }
        }

      }]);

}());
