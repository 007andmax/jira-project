'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.commissionsCtrl',
    ['$scope', 'UsersService', 'ProductsService', 'ServicesService', 'CompaniesService', 'quicktech.common.services.NewConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, UsersService, ProductsService, ServicesService, CompaniesService, NewConfirmationsService, UserNotificationService) {

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

        $scope.getFullName = function (client) {
          if (client) {
            var isAllSpaces = client.lastName === "    ";
            if (client.lastName && !isAllSpaces) {
              return client.firstName + ' ' + client.lastName;
            } else {
              return client.firstName;
            }
          }
        };

        $scope.getUserByID = function(userId) {
          if(!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if(user) {
            if(user.lastName === '    ') {
              return user.firstName
            } else {
              return user.firstName+' '+user.lastName;
            }
          }
        };

        $scope.setTechLeadId = function(company) {
          console.log(company, 'copany')


          CompaniesService.setTechLead(company.id, company.techLeadId, function(res) {
            console.log(res)
          })
        }

        $scope.activeTechUsers = function() {

          console.log('techUsers', UsersService.getTechUsers().filter(function(el) {
            return el.userEnabled && !el.deletedAt;
          }))
          return UsersService.getTechUsers().filter(function(el) {
            return el.userEnabled && !el.deletedAt;
          })
        }

        $scope.agreementsCommissions = {}

        $scope.clientsCompanies = CompaniesService.getClientCompanies().sort(function(a, b) {
          return a.name.localeCompare(b.name);
        })



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

              NewConfirmationsService.show(confirmMessage, confirmButton, function () {
                data.setForOldExpenses = true;
                CompaniesService.setCategoryRate(id, data, function(res) {
                  console.log(res, 'Set category rate')
                })
              }, function() {
                CompaniesService.setCategoryRate(id, data, function(res) {
                  console.log(res, 'Set category rate')
                })
              }, function() {
                var category = $scope.categories.find(function(el) {
                  return el.id === id;
                })

                category.commissionRate = null;
              })
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



              NewConfirmationsService.show(confirmMessage, confirmButton, function () {
                data.setForOldExpenses = true;
                CompaniesService.setServiceRate(id, data, function(res) {
                  console.log(res, 'Set service rate')
                })
              }, function() {
                CompaniesService.setServiceRate(id, data, function(res) {
                  console.log(res, 'Set service rate')
                })
              }, function() {
                var specialServices = $scope.specialServices;
                var services = $scope.services;

                var service = specialServices.find(function(el) {
                  return el.id === id;
                });

                if (!service) {
                  service = services.find(function(el) {
                    return el.versionedId.id === id;
                  })
                }

                service.commissionRate = null;
              })
            } else {
              CompaniesService.setServiceRate(id, data, function(res) {
                console.log(res, 'Set service rate')
              })
            }
          }

        }

        $scope.setAgreementRate = function(flag, rate) {

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
          console.log(rates, "RATES")
          if (!rates[flag]) {
            NewConfirmationsService.show(confirmMessage, confirmButton, function () {
              data[flag] = true
              CompaniesService.setAgreementsRate(data, function(res) {
                console.log('res from agreements', res)
              })
            }, function() {
              CompaniesService.setAgreementsRate(data, function(res) {
                console.log('res from agreements', res)
              })
            }, function() {
              rates[rate] = null;
            })
          } else {
            CompaniesService.setAgreementsRate(data, function(res) {
              console.log('res from agreements', res)
            })
          }




        }

      }]);

}());
