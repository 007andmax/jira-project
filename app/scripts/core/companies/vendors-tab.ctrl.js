'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.vendorsTabCtrl',
    ['$scope', 'AssociationService',
      function ($scope, AssociationService) {

        $scope.getPriorityContact = function () {
          var vendorContacts = $scope.association.vendor.contacts;
          var priority;
          var index;
          for (var i = 0; i < vendorContacts.length; i++) {
            if (priority === undefined || vendorContacts[i].priority < priority) {
              priority = vendorContacts[i].priority;
              index = i;
            }
          }
          return $scope.association.vendor.contacts[index];
        };

        $scope.sendMail = function () {
          console.log('send mail ' + $scope.association.vendor.name);
        };

        $scope.dissociateVendor = function () {
          AssociationService.deleteAssociation($scope.association.id);
        };

      }]);

}());
