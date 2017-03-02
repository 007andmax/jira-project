'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.invoiceContactCtrl',
    ['$scope', 'EmailSettingsService',
      function ($scope, EmailSettingsService) {

        EmailSettingsService.getInvoiceContact(function (resp) {
          $scope.invoiceContact = resp || {};
          $scope.invoiceContact.phoneNumbers = $scope.invoiceContact.phoneNumbers || [];
        });

        $scope.toggleInvoiceContact = function (enabled) {
          EmailSettingsService.toggleInvoiceContact(enabled);
        };

        $scope.saveInvoiceContact = function (form, ignoreValidity) {
          if (form && form.$valid || $scope.invoiceContactForm && $scope.invoiceContactForm.$valid || ignoreValidity) {
            var invoiceContact = angular.copy($scope.invoiceContact);
            EmailSettingsService.saveInvoiceContact(invoiceContact, function () {
              form && form.$setPristine() || $scope.invoiceContactForm && $scope.invoiceContactForm.$setPristine();
            });
          }
        };

      }]);

}());
