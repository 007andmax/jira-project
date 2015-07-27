'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService', 'CompaniesService',
      function ($scope, ServicesService, CompaniesService) {

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.services = ServicesService.getAllByCompany($scope, CompaniesService.getCurrentCompany().id, function () {
          console.log($scope.services);
        });


        $scope.cancelCreateService = function () {
          console.log("cancelCreateService");
          $scope.showCreateService = false;
        };
        $scope.saveCreateService = function () {
          console.log("saveCreateService");
        };

        $scope.createService = function () {
          console.log("createService");
          $scope.showCreateService = true;
        };

        $scope.numberInTime = function (num) {
          //if (num !== undefined) {
          //  num = num.toString();
          //  var hours = (num.split('.')[0]);
          //  if (num.split('.')[1]) {
          //    var minuts = ((num.split('.')[1].length === 2 ? num.split('.')[1] : num.split('.')[1] + '0') * 60 / 100) || 0;
          //  } else {
          //    var minuts = 0;
          //  }
          //  if (+num < 1 && +num !== 0) {
          //    return minuts + ' minutes';
          //  } else if (+num === 0) {
          //    return "0 minut";
          //  } else if (+minuts === 0) {
          //    return hours + (hours === 1 ? " hour" : " hours");
          //  } else if (+num < 2) {
          //    return hours + ' hour ' + minuts + ' minutes';
          //  } else {
          //    return hours + ' hours ' + minuts + ' minutes';
          //  }
          //}
        };

    }]);

}());
