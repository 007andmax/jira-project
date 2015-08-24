'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorCtrl',
    ['$scope',
      function ($scope) {

        $scope.setShownSection = function (val) {
          $scope.shownSection = val;
        };

        //todo get contacts from db
        $scope.contacts = [
          {
            id: 1,
            name: 'Contact 1',
            label: 'marketing manager',
            phone: '123 456 789'
          },
          {
            id: 2,
            name: 'Contact 2',
            label: ' manager',
            phone: '123 888 789'
          },
          {
            id: 3,
            name: 'Contact 3',
            label: 'marketing ',
            phone: '123 456 333'
          }
        ]

      }]);

}());
