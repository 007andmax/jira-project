'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.activityCtrl',
    ['$scope', 'RightPanelService', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, RightPanelService, SharedStateService, UsersService) {

        var caseToSetTicketNumber = ['TICKET_UPDATE_NOTE_ADDED', 'TICKET_CLAIMED', 'TICKET_UPDATE_NOTE_DELETED',
          'TICKET_CREATED_FOR_USER', 'TICKET_CREATED_FOR_AGENT', 'TICKET_CREATED_VIA_EMAIL', 'TICKET_UPDATE_SERVICE_EXPENSE_EDIT', 'TICKET_UPDATE_PRODUCT_EXPENSE_EDIT',
          'TICKET_UPDATE_SERVICE_EXPENSE_ADDED', 'TICKET_UPDATE_SERVICE_EXPENSE_DELETE', 'TICKET_UPDATE_PRODUCT_EXPENSE_ADDED', 'TICKET_UPDATE_PRODUCT_EXPENSE_DELETE',
          'TICKET_UPDATE_ATTACHMENT_ADDED', 'TICKET_UPDATE_ATTACHMENT_DELETED', 'TICKET_ASSIGNED', 'TICKET_REASSIGNED', 'TICKET_PRIORITY_LOW', 'TICKET_PRIORITY_MEDIUM',
          'TICKET_PRIORITY_HIGH', 'TICKET_STATUS_ON_HOLD', 'TICKET_STATUS_IN_PROGRESS', 'TICKET_REPORTED_AS_SPAM', 'TICKET_MARKED_AS_SPAM', 'TICKET_UPDATE_CREATE_SHARED'
          , 'TICKET_UPDATE_DELETE_SHARED', 'TICKET_STATUS_COMPLETED', 'TICKET_TO_TRASH', 'TICKET_OPEN', 'INVOICE_SEND'];

        var caseToSetAditionalUser = ['TICKET_CREATED_FOR_USER', 'TICKET_CREATED_FOR_AGENT', 'TICKET_ASSIGNED', 'TICKET_REASSIGNED', 'TICKET_UPDATE_CREATE_SHARED',
          'TICKET_UPDATE_DELETE_SHARED'];

        var caseToSetCompanyName = ['INVOICE_SEND', 'RECURRING_INVOICE_CREATED', 'INVOICE_RESEND', 'INVOICE_PAYMENT_RECEIVE_ALL_IN_COMPANY', 'SERVICE_MOVED',
          'SERVICE_DELETED', 'COMPANY_CREATED', 'COMPANY_ARCHIVED', 'COMPANY_BASIC_INFO', 'COMPANY_LOCATION_ADDED', 'COMPANY_LOCATION_EDITED',
          'COMPANY_CONTACT_EDITED_INFO', 'COMPANY_CONTACT_ADDED', 'COMPANY_COVER_CHANGED', 'COMPANY_ASSOCIATION_CREATED', 'COMPANY_ASSOCIATION_REMOVED',
          'COMPANY_TAX_RATE_ADDED', 'COMPANY_TAX_RATE_REMOVED', 'COMPANY_TAX_RATE_EDITED', 'SERVICE_EDITED_RATE'];

        var caseToSetInvoiceNumber = ['RECURRING_INVOICE_CREATED', 'RECURRING_INVOICE_PRODUCT_EDIT', 'RECURRING_INVOICE_SERVICE_EDIT', 'RECURRING_INVOICE_PRODUCT_DELETE',
          'RECURRING_INVOICE_SERVICE_DELETE', 'INVOICE_RESEND', 'INVOICE_PAYMENT_RECEIVE'];

        var caseToSetCategoryName = ['PRODUCT_CATEGORY_ADDED', 'PRODUCT_CATEGORY_RENAMED', 'PRODUCT_ADDED', 'PRODUCT_EDITED_SALE', 'PRODUCT_EDITED_DESCRIPTION',
          'PRODUCT_EDITED_COST', 'PRODUCT_CATEGORY_DELETED'];

        var caseToSetProductName = ['PRODUCT_ADDED', 'PRODUCT_EDITED_NAME', 'PRODUCT_EDITED_SALE', 'PRODUCT_EDITED_DESCRIPTION', 'PRODUCT_EDITED_COST', 'PRODUCT_EDITED_VENDOR',
          'TICKET_UPDATE_PRODUCT_EXPENSE_ADDED'];

        var caseToSetServiceName = ['SERVICE_ADDED', 'SERVICE_EDITED_NAME', 'SERVICE_EDITED_TIME', 'SERVICE_EDITED_RATE', 'SERVICE_MOVED', 'SERVICE_DELETED',
          'SERVICE_DELETED_DEFAULT', 'TICKET_UPDATE_SERVICE_EXPENSE_EDIT', 'SERVICE_EDITED_RATE_DEFAULT'];

        var caseToSetNewProductName = ['PRODUCT_EDITED_NAME'];
        var caseToSetNewCategoryName = ['PRODUCT_CATEGORY_RENAMED'];
        var caseToSetNewServiceName = ['SERVICE_EDITED_NAME'];

        var caseToSetContactFirstName = ['COMPANY_CONTACT_ADDED', 'COMPANY_CONTACT_EDITED_SUBS_TKT', 'COMPANY_CONTACT_EDITED_SUBS_INV', 'COMPANY_CONTACT_EDITED_UNSUBS_INV',
          'COMPANY_CONTACT_EDITED_UNSUBS_TKT', 'COMPANY_CONTACT_EDITED_AVATAR_CHANGED', 'COMPANY_CONTACT_EDITED_AVATAR_CUSTOMIZED', 'VENDOR_CONTACT_ADDED',
          'VENDOR_CONTACT_EDITED_AVATAR_CHANGED', 'VENDOR_CONTACT_EDITED_AVATAR_CUSTOMIZED', 'VENDOR_CONTACT_EDITED_SUBS_TKT', 'VENDOR_CONTACT_EDITED_UNSUBS_TKT'];
        var caseToSetContactLastName = ['COMPANY_CONTACT_ADDED', 'VENDOR_CONTACT_ADDED'];

        var caseToSetVendorName = ['COMPANY_ASSOCIATION_CREATED', 'COMPANY_ASSOCIATION_REMOVED', 'VENDOR_CREATED', 'VENDOR_ARCHIVED', 'VENDOR_LOCATION_EDITED',
          'VENDOR_LOCATION_ADDED', 'VENDOR_CONTACT_EDITED_INFO', 'VENDOR_CONTACT_ADDED', 'VENDOR_BASIC_INFO'];

        var caseToSetTaxType = ['COMPANY_TAX_RATE_ADDED', 'COMPANY_TAX_RATE_REMOVED', 'COMPANY_TAX_RATE_EDITED'];

        var caseToSetUserFirstName = ['USER_CREATED', 'USER_EDITED_SUBS_TKT', 'USER_EDITED_INFO', 'USER_EDITED_SUBS_INV', 'USER_EDITED_UNSUBS_INV', 'USER_EDITED_UNSUBS_TKT',
          'USER_EDITED_ROLE_ADMIN', 'USER_REMOVED', 'USER_EDITED_AVATAR_CHANGED', 'USER_EDITED_AVATAR_CUSTOMIZED'];
        var caseToSetUserLastName = ['USER_CREATED'];

        setUserInfo();

        if (caseToSetTicketNumber.indexOf($scope.activity.action) !== -1) {
          setTicketNumber();
        }

        if (caseToSetAditionalUser.indexOf($scope.activity.action) !== -1) {
          setAditionalUserName();
        }

        if (caseToSetCompanyName.indexOf($scope.activity.action) !== -1) {
          setCompanyName();
        }

        if (caseToSetInvoiceNumber.indexOf($scope.activity.action) !== -1) {
          setInvoiceNumber();
        }

        if (caseToSetCategoryName.indexOf($scope.activity.action) !== -1) {
          setCategoryName();
        }

        if (caseToSetNewCategoryName.indexOf($scope.activity.action) !== -1) {
          setNewCategoryName();
        }

        if (caseToSetProductName.indexOf($scope.activity.action) !== -1) {
          setProductName();
        }

        if (caseToSetNewProductName.indexOf($scope.activity.action) !== -1) {
          setNewProductName();
        }

        if (caseToSetServiceName.indexOf($scope.activity.action) !== -1) {
          setServiceName();
        }

        if (caseToSetNewServiceName.indexOf($scope.activity.action) !== -1) {
          setNewServiceName();
        }

        if (caseToSetContactFirstName.indexOf($scope.activity.action) !== -1) {
          setContactFirstName();
        }

        if (caseToSetContactLastName.indexOf($scope.activity.action) !== -1) {
          setContactLastName();
        }

        if (caseToSetVendorName.indexOf($scope.activity.action) !== -1) {
          setVendorName();
        }

        if (caseToSetTaxType.indexOf($scope.activity.action) !== -1) {
          setTaxType();
        }

        if (caseToSetUserFirstName.indexOf($scope.activity.action) !== -1) {
          setUserFirstName();
        }

        if (caseToSetUserLastName.indexOf($scope.activity.action) !== -1) {
          setUserLastName();
        }

        function setUserInfo() {

          if ($scope.activity.user.id === $scope.currentUser.id) {
            $scope.userName = 'You';
          } else {
            var user = UsersService.getOneById($scope.activity.user.id);
            $scope.userName = $scope.activity.userName;
          }
          $scope.userAvatarUrl = $scope.getUserAvatarUrl(user);
        }

        function setTicketNumber() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].ticketNumber) {
            $scope.ticketNumber = $scope.activity.firstList[0].ticketNumber;
          } else {
            console.error('can not find ticketNumber in activity ' + $scope.activity.action)
          }
        }

        function setAditionalUserName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].userFirstName) {
            $scope.aditionalUserName = $scope.activity.firstList[0].userFirstName;
          } else {
            console.error('can not find aditionalUserName in activity ' + $scope.activity.action)
          }
        }

        function setCompanyName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].companyName) {
            $scope.companyName = $scope.activity.firstList[0].companyName;
          } else {
            if($scope.activity.secondList && $scope.activity.secondList[0] && $scope.activity.secondList[0].companyName){
              $scope.companyName = $scope.activity.secondList[0].companyName;
            } else {
              console.error('can not find companyName in activity ' + $scope.activity.action)
            }
          }
        }

        function setInvoiceNumber() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].invoiceNumber) {
            $scope.invoiceNumber = $scope.activity.firstList[0].invoiceNumber;
          } else {
            console.error('can not find invoiceNumber in activity ' + $scope.activity.action)
          }
        }

        function setCategoryName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].categoryName) {
            $scope.categoryName = $scope.activity.firstList[0].categoryName;
          } else {
            console.error('can not find categoryName in activity ' + $scope.activity.action)
          }
        }

        function setNewCategoryName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].newCategoryName) {
            $scope.newCategoryName = $scope.activity.firstList[0].newCategoryName;
          } else {
            console.error('can not find newCategoryName in activity ' + $scope.activity.action)
          }
        }

        function setProductName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].productName) {
            $scope.productName = $scope.activity.firstList[0].productName;
          } else {
            console.error('can not find productName in activity ' + $scope.activity.action)
          }
        }

        function setNewProductName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].newProductName) {
            $scope.newProductName = $scope.activity.firstList[0].newProductName;
          } else {
            console.error('can not find newProductName in activity ' + $scope.activity.action)
          }
        }

        function setServiceName() {
          if($scope.activity.action === 'SERVICE_MOVED'){
            if ($scope.activity.secondList[0] && $scope.activity.secondList[0].serviceName) {
              $scope.serviceName = $scope.activity.secondList[0].serviceName;
            } else {
              console.error('can not find serviceName in activity ' + $scope.activity.action)
            }
            return;
          }

          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].serviceName) {
            $scope.serviceName = $scope.activity.firstList[0].serviceName;
          } else {
            console.error('can not find serviceName in activity ' + $scope.activity.action)
          }
        }

        function setNewServiceName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].newServiceName) {
            $scope.newServiceName = $scope.activity.firstList[0].newServiceName;
          } else {
            console.error('can not find newServiceName in activity ' + $scope.activity.action)
          }
        }

        function setContactFirstName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].contactFirstName) {
            $scope.contactFirstName = $scope.activity.firstList[0].contactFirstName;
          } else {
            console.error('can not find contactFirstName in activity ' + $scope.activity.action)
          }
        }

        function setContactLastName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].contactLastName) {
            $scope.contactLastName = $scope.activity.firstList[0].contactLastName;
          } else {
            console.error('can not find contactLastName in activity ' + $scope.activity.action)
          }
        }

        function setVendorName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].vendorName) {
            $scope.vendorName = $scope.activity.firstList[0].vendorName;
          } else {
            console.error('can not find vendorName in activity ' + $scope.activity.action)
          }
        }

        function setTaxType() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].taxType) {
            $scope.taxType = $scope.activity.firstList[0].taxType;
          } else {
            console.error('can not find taxType in activity ' + $scope.activity.action)
          }
        }

        function setUserFirstName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].userFirstName) {
            $scope.userFirstName = $scope.activity.firstList[0].userFirstName;
          } else {
            console.error('can not find userFirstName in activity ' + $scope.activity.action)
          }
        }

        function setUserLastName() {
          if ($scope.activity.firstList[0] && $scope.activity.firstList[0].userLastName) {
            $scope.userLastName = $scope.activity.firstList[0].userLastName;
          } else {
            console.error('can not find userLastName in activity ' + $scope.activity.action)
          }
        }

      }]);
}());
