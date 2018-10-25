'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.commissionsCtrl',
    ['$scope', 'UsersService', 'ProductsService', 'ServicesService', 'CompaniesService', 'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, UsersService, ProductsService, ServicesService, CompaniesService, UserConfirmationsService, UserNotificationService) {

        var confirmMessage = 'Do you want this commission to fact old items?';
        var confirmButton = 'Yes';
        var agreementsFlags = {
          commissionRateSetOldSalesBlockTime: false,
          commissionRateSetOldSalesBlockTimeExceeding: false,
          commissionRateSetOldSalesUserOrDeviceContract: false,
          commissionRateSetOldSalesUserOrDeviceContractExceeding: false
        }


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

        });

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

        $scope.setCategoryRate = function(id, rate, category) {



          if (rate || rate === 0) {

            var data = {
              rate: rate,
              setForOldExpenses: false
            }


            if (!category.commissionRateSetOldSales) {

              UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
                data.setForOldExpenses = true;
                CompaniesService.setCategoryRate(id, data, function(res) {
                  console.log(res, 'Set category rate')
                })
              }, function() {
                CompaniesService.setCategoryRate(id, data, function(res) {
                  console.log(res, 'Set category rate')
                })
              });
            } else {
              CompaniesService.setCategoryRate(id, data, function(res) {
                console.log(res, 'Set category rate')
              })
            }

          }

        }

        $scope.setServiceRate = function(id, rate, service) {

          if (rate || rate === 0) {
            var data = {
              rate: rate,
              setForOldExpenses: false
            }

            if (!service.commissionRateSetOldSales) {



              UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
                data.setForOldExpenses = true;
                CompaniesService.setServiceRate(id, data, function(res) {
                  console.log(res, 'Set service rate')
                })
              }, function() {
                CompaniesService.setServiceRate(id, data, function(res) {
                  console.log(res, 'Set service rate')
                })
              });
            } else {
              CompaniesService.setServiceRate(id, data, function(res) {
                console.log(res, 'Set service rate')
              })
            }
          }

        }

        $scope.setAgreementRate = function(flag) {

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

          data = Object.assign({}, data, agreementsFlags);

          if (!rates[flag]) {
            UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
              data[flag] = true
              CompaniesService.setAgreementsRate(data, function(res) {
                console.log('res from agreements', res)
              })
            }, function() {
              CompaniesService.setAgreementsRate(data, function(res) {
                console.log('res from agreements', res)
              })
            });
          } else {
            CompaniesService.setAgreementsRate(data, function(res) {
              console.log('res from agreements', res)
            })
          }




        }

      }]);

}());
