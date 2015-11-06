'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.emailTemplatesCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'EmailSettingsService',
      function ($scope, $state, $stateParams, $location, EmailSettingsService) {

        $scope.numberPattern = /^\d+$/;

        $scope.ticketTemplates = {
          'TU_ADDED': 'A new Ticket Update is added',
          'TU_EDITED': 'A Ticket Update is edited',
          'TU_DELETED': 'A Ticket Update is deleted',
          'TICKET_ASSIGNED': 'A Ticket is assigned/re-assigned',
          'TICKET_CREATED': 'A new Ticket is created',
          'TICKET_CLOSED': 'A Ticket is closed',
          'TICKET_OPENED': 'A Ticket is marked as Open',
          'TICKET_SPAM': 'A Ticket is marked/reported as Spam',
          'TICKET_TRASH': 'A Ticket is moved to Trash'
        };

        $scope.agentTemplates = {
          'AGENT_CREATED': "A new Agent is created",
          'AGENT_ARCHIVED': "An Agent is archived",
          'AGENT_CONTACT_MODIFIED': "Agent's contact information is modified",
          'AGENT_TICKET_RESTORE': "A Ticket is restored to its original folder from either Spam or Trash",
          'AGENT_ROLE_UPGRADED': "Agent's privilege is upgraded to either Administrator or Super Admin",
          'AGENT_ROLE_DOWNGRADED': "Agent's privilege is downgraded to either Administrator or User"
        };

        $scope.usersTemplates = {
          'USER_CREATED': "A new user is created",
          'USER_CONTACT_INFO_CHANGED': "User's contact information is modified",
          'USER_IS_ARCHIVED': "A user is archived",
          'USER_SUBS_TU': "A user is subscribed to Ticket Updates",
          'USER_SUBS_INV': "A user is subscribed to Invoice Updates",
          'USER_ROLE_UPGRADED': "User's privilege is upgraded to Administrator",
          'USER_ROLE_DOWNGRADED': "User's privilege is downgraded to User"
        };

        $scope.companyTemplates = {
          'COMPANY_CREATED': "A new company is created",
          'COMPANY_BASIC_INFO': "Company’s basic information is modified",
          'COMPANY_ARCHIVED': "A company is archived",
          'COMPANY_PRIMARY_CONTACT_ADDED': "A new primary contact is added",
          'COMPANY_PRIMARY_CONTACT_INFO': "A primary contact information is modified",
          'COMPANY_LOCATION_ADDED': "A new site/location is added",
          'COMPANY_LOCATION_EDITED': "A site/location is modified",
          'COMPANY_TAX_ADDED': "Tax information is added",
          'COMPANY_TAX_EDITED': "Tax information is modified",
          'COMPANY_AGENT_APP_CREATED': "A new agent application is created",
          'COMPANY_AGENT_APP_LOGIN': "Agent application's login information is modified",
          'COMPANY_AGENT_APP_UPDATED': "Agent application is updated to latest available version",
          'COMPANY_DEVICE_ADDED': "A new device is added",
          'COMPANY_DEVICE_REMOVED': "A device is removed"
        };

        $scope.invoiceTemplates = {
          'COMPANY_INV_SENT': "An Invoice is sent",
          'COMPANY_INV_RESENT': "An Invoice is re-sent",
          'COMPANY_OVERDUE_INV_SENT': "An Overdue Invoice is sent",
          'COMPANY_PAYMENT_RECEIVED': "A payment is received"
        };

        $scope.vendorTemplates = {
          'VENDOR_CREATED': "A new vendor is created",
          'VENDOR_BASIC_INFO': "Vendor’s basic information is modified",
          'VENDOR_ARCHIVED': "A vendor is archived",
          'VENDOR_NEW_PRIMARY_CONTACT': "A new primary contact is added",
          'VENDOR_PRIMARY_CONTACT_EDITED': "Primary contact’s information is modified",
          'VENDOR_LOCATION_ADDED': "A new site/location is added",
          'VENDOR_LOCATION_EDITED': "A site/location is modified",
          'VENDOR_PRIM_CONTACT_SUBS_TU': "Vendor's primary contact is subscribed to Ticket Updates"
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
          return form[fieldName] && (form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.saveEmailTemplate = function (templateKey, form) {
          if (form.$valid) {
            $scope.savingInProcess = true;

            EmailSettingsService.saveEmailTemplate($scope.templatesData, templateKey, function () {
              $scope.openEmailTemplate('CLOSE');
              form.$setPristine();
              $scope.savingInProcess = false;
            })
          }
        }

      }]);

}());
