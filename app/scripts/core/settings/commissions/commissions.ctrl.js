'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.commissionsCtrl',
    ['$scope', 'UsersService', 'ProductsService', 'ServicesService', 'CompaniesService',
      function ($scope, UsersService, ProductsService, ServicesService, CompaniesService) {

        console.log('commissions controller')

        $scope.view = 'product';

        $scope.setView = function(view) {
          $scope.view = view;
        }

        $scope.agreementsCommissions = {}



        ProductsService.getCategories($scope, function(res) {
          $scope.categories = res;
        })

        ServicesService.getServicesData($scope, function(res) {
          $scope.services = res;

        })

        ServicesService.getSpecialServices(function(res) {
          $scope.specialServices = [];

          res.data.forEach(function(el) {
            el.services.forEach(function(service) {
              if (!service.basedOnDefault) {
                $scope.specialServices.push(service)
              }
            })
          })
        })

        CompaniesService.getAgreementsRates(function(res) {
          $scope.agreementsCommissions = res.data || {};

        })

//         CompaniesService.setAgreementsRate({"blockTimeContractCommission":123,
// "blockTimeContractCommissionExceeding":123,
// "userOrDeviceContractCommission":123,
// "userOrDeviceContractCommissionExceeding":123}, function(res) {
//   console.log(res, "RES FROM AGReEM")
// })

        $scope.setCategoryRate = function(id, rate) {

          if (rate || rate === 0) {
            CompaniesService.setCategoryRate(id, rate, function(res) {
              console.log(res, 'Set category rate')
            })
          }

        }

        $scope.setServiceRate = function(id, rate) {

          if (rate || rate === 0) {
            CompaniesService.setServiceRate(id, rate, function(res) {
              console.log(res, 'Set service rate')
            })
          }

        }

        $scope.setAgreementRate = function() {
          console.log($scope.agreementsCommissions, 'saddsad')

          Object.keys($scope.agreementsCommissions).forEach(function(key) {
            $scope.agreementsCommissions[key] = +$scope.agreementsCommissions[key];
          });

          var rates = $scope.agreementsCommissions;
          var data = {
            blockTimeContractCommission: rates.blockTimeContractCommission,
            blockTimeContractCommissionExceeding: rates.blockTimeContractCommissionExceeding,
            userOrDeviceContractCommission: rates.userOrDeviceContractCommission,
            userOrDeviceContractCommissionExceeding: rates.userOrDeviceContractCommissionExceeding
          }

          CompaniesService.setAgreementsRate(data, function(res) {
            console.log('res from agreements', res)
          })
        }

      }]);

}());
