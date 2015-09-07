'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.vendorsTabCtrl',
    ['$scope',
      function ($scope) {

        $scope.getPriorityContact = function () {
          var priority;
          var index;
          for (var i = 0; i < $scope.vendor.contacts.length; i++) {
            if (priority === undefined || $scope.vendor.contacts[i].priority < priority) {
              priority = $scope.vendor.contacts[i].priority;
              index = i;
            }
          }
          return $scope.vendor.contacts[index];
        };

        $scope.sendMail = function () {
          console.log('send mail ' + $scope.vendor.name);
        };

        $scope.dissociateVendor = function () {
          console.log('dissociate vendor ' + $scope.vendor.name);
        };

      }]);

}());
