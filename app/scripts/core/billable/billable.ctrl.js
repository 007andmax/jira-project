'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.PermissionsService', 'TicketsService', 'TaxesService',
      function ($scope, BillableService, CompaniesService, SharedStateService, PermissionsService, TicketsService, TaxesService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        TicketsService.getCounts($scope, function (resp) {
          globalSearch.count = resp.BILLABLE || 0;

          $scope.$watch(function () {
            return resp.BILLABLE;
          }, function (value) {
            globalSearch.count = value || 0;
          });
        });

        $scope.taxes = TaxesService.getAll();

        $scope.PermissionsService = PermissionsService;
        $scope.headerSharedState = SharedStateService.getSharedState('billableHeader');
        $scope.loadingInProgress = true;
        $scope.ticketsSelection = {};

        $scope.isDisocuntForIcon = function(billableCompany){
          var isDiscount=false;
          for(var t = 0; t < billableCompany.tickets.length; t++) {
            if(billableCompany.tickets[t].discountSum > 0) {
              isDiscount = true;
            }
            if(billableCompany.tickets[t].productExpense) {
              for(var m=0; m < billableCompany.tickets[t].productExpense.length; m++) {
                if(billableCompany.tickets[t].productExpense[m].discountSum > 0) {
                  isDiscount = true;
                }
              }
            }
            if(billableCompany.tickets[t].serviceExpense) {
              for(var n=0; n < billableCompany.tickets[t].serviceExpense.length; n++) {
                if(billableCompany.tickets[t].serviceExpense[n].discountSum > 0) {
                  isDiscount = true;
                }
              }
            }
          }
          return isDiscount;
        };

        $scope.isDiscountForIconTicket = function(ticket) {
          var isTicketDiscount = false;
          if(ticket.discountSum > 0) {
            isTicketDiscount = true;
          }
          if(ticket.productExpense) {
            for(var e=0; e < ticket.productExpense.length; e++) {
              if(ticket.productExpense[e].discountSum > 0) {
                isTicketDiscount = true;
              }
            }
          }
          if(ticket.serviceExpense) {
            for(var w=0; w < ticket.serviceExpense.length; w++) {
              if(ticket.serviceExpense[w].discountSum > 0) {
                isTicketDiscount = true;
              }
            }
          }
          return isTicketDiscount;
        };

        $scope.companyData = CompaniesService.getCompanyForSettingPage(function () {
          $scope.$watch('companyData.addresses[0].address', function (address) {
            $scope.isCurrentCompanyAddressEmpty = !address;
          });
        });

        $scope.billableData = BillableService.getBillablePageDto($scope, function (respData) {
          console.log("respData: ", respData);
          $scope.billableData = respData;

          var companyIds = Object.keys(respData).filter(function (id) {
            return id !== 'staticCopy' && !CompaniesService.getOneById(id).isDefault;
          });

          if (respData && !companyIds.length) {
            $scope.loadingInProgress = false;
          }

          var companies = [];
          $scope.totalbillables = 0;

          for (var companyId in $scope.billableData) {

            if (companyId !== 'staticCopy') {
              var company = CompaniesService.getOneById(companyId);
              $scope.totalbillables += $scope.billableData[companyId].totalSum || 0;

              companies.push(company);
            }
          }

          for (var companyId in $scope.ticketsSelection) {

            if (!$scope.billableData[companyId]) {
              delete $scope.ticketsSelection[companyId];
              continue;
            }

            var tickets = $scope.ticketsSelection[companyId].tickets;

            for (var ticketId in  tickets) {

              for (var i = 0; i < $scope.billableData[companyId].tickets.length; i++) {
                if (ticketId === $scope.billableData[companyId].tickets[i].id) {
                  if ($scope.billableData[companyId].tickets[i].lockedBy) {
                    tickets[ticketId] = false;
                    $scope.ticketsSelection[companyId].checked = false;
                  }
                }
              }

            }
          }
        });

        $scope.addDiscountInBillable = function (expenseId, discountAmount) {
          var data = {};
          if(expenseId && discountAmount) {
            data= {
              expenseId: expenseId,
              discountAmount: discountAmount,
              discountType: 'PERCENT'
            };
            BillableService.saveBillableDiscount(data, function(resp){
              console.log("saveBillableDiscount: ", resp)
            })
          }
          else {
            data= {
              expenseId: expenseId,
              discountAmount: null,
              discountType: null
            };
            BillableService.saveBillableDiscount(data, function(resp){
              console.log(resp)
            })
          }

        };

        $scope.loadingFinished = function () {
          $scope.loadingInProgress = false;
        };

        $scope.anotherCompanySelected = function (companyId) {
          if ($scope.ticketsSelection[companyId] && $scope.ticketsSelection[companyId].checked) {
            return false;
          }

          for (var id in $scope.ticketsSelection) {
            var selectionByCompany = $scope.ticketsSelection[id];

            if (selectionByCompany.checked) {
              return true;
            } else {
              for (var ticketId in selectionByCompany.tickets) {
                if (selectionByCompany.tickets[ticketId]) {
                  return id !== companyId;
                }
              }
            }
          }
        };

        $scope.changeCompanyCheckbox = function (companyId) {

          var ticketsSelection = $scope.ticketsSelection[companyId];

          if (ticketsSelection.tickets !== undefined) {
            for (var ticketId in ticketsSelection.tickets) {

              var isticketLocked;

              for (var i = 0; i < $scope.billableData[companyId].tickets.length; i++) {
                if (ticketId === $scope.billableData[companyId].tickets[i].id) {
                  if ($scope.billableData[companyId].tickets[i].lockedBy) {
                    isticketLocked = true;
                  }
                  break;
                }
              }

              ticketsSelection.tickets[ticketId] = ticketsSelection.checked && !isticketLocked;
            }
          }

        };

        $scope.changeTicketCheckbox = function (companyId) {

          var countObj = 0,
            ticketsSelectionCompany = $scope.ticketsSelection[companyId];

          for (var ticketId in (ticketsSelectionCompany.tickets)) {
            if (ticketsSelectionCompany.tickets[ticketId]) {
              countObj++;
            }
          }

          ticketsSelectionCompany.checked = ($scope.billableData[companyId].tickets.length === countObj);
        };

        $scope.$watch('ticketsSelection', function () {
          $scope.countTicket = 0;
          for (var key in $scope.ticketsSelection) {
            if ($scope.ticketsSelection[key].checked) {
              $scope.countTicket++;
            } else {
              for (var id in $scope.ticketsSelection[key].tickets) {
                if ($scope.ticketsSelection[key].tickets[id]) {
                  $scope.countTicket++;
                }
              }
            }
          }
        }, true);

        $scope.saveTaxes = function (entity, entityType) {
          TaxesService.linkWithEntity(entity.id, entityType, entity.taxes);
        };

      }]);

}());
