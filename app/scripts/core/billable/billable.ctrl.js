'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.PermissionsService', 'TicketsService', 'TaxesService', '$uibModal', '$rootScope',
      function ($scope,
                BillableService,
                CompaniesService,
                SharedStateService,
                PermissionsService,
                TicketsService,
                TaxesService,
                $uibModal,
                $rootScope) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        TicketsService.getCounts($scope, function (resp) {
          globalSearch.count = resp.BILLABLE || 0;

          $scope.$watch(function () {
            return resp.BILLABLE;
          }, function (value) {
            globalSearch.count = value || 0;
          });
        });

        TaxesService.getAll(function (resp) {
          $scope.taxes = resp;
        });


        $scope.$watch(function() {
          return $rootScope.currentBillTo;
        }, function(val) {

          if (val) {
            $scope.invoiceBillTo = CompaniesService.getCompanyByAddressId(val.id);

            var companyData = CompaniesService.getCompanyData($scope, $scope.invoiceBillTo.id, function() {
              // console.log(companyData, 'DATA DATA DATA')
              $scope.invoiceBillTo.contacts = companyData.contacts;
            })

            // console.log($scope.invoiceBillTo, 'billtotot')
          }

        })

        $scope.deleteTicket = function(ticket) {
          console.log(ticket)
          TicketsService.deleteForever(ticket.id, function(res) {

          })
          // console.log(ticket)
        }

        $scope.$watch(function() {
          return $rootScope.deletedTicket;
        }, function(val) {
          var keys = Object.keys($scope.billableData).filter(function(prop) {
            return $scope.billableData.hasOwnProperty(prop);
          });


          loop: for (var i = 0; i < keys.length; i++) {
            var tickets = $scope.billableData[keys[i]].tickets;
            if (!tickets) continue;

            for (var j = 0; j <= tickets.length; j++) {
              if (tickets[j] && tickets[j].id === val) {
                tickets.splice(j, 1);

                break loop;
              }
            }
          }
        })



        $scope.$watch(function() {
          return $rootScope.updateBillTo;
        }, function(val) {

          if (val) {

            // console.log(val, 'val')
            var companyName = val.companyName.$modelValue;
            var firstName = val.firstName.$modelValue;
            var lastName = val.lastName.$modelValue;
            var address = val.addressForm.address.$modelValue;
            var zip = val.zip.$viewValue;
            var suiteNum = val.suiteNumber.$viewValue;
            var email = val.primaryEmail.$viewValue;
            var phone = val['forms.phoneNumbersForm'].phoneNumber0.$viewValue;

            var fullAddress = address;

            if (suiteNum && address) {
              fullAddress = suiteNum + ', ' + fullAddress;
            }

            if (zip && address) {
              fullAddress = fullAddress + ', ' + zip;
            }

            $scope.invoiceBillTo.companyInfo.contacts[0].primaryEmail = email;

            $scope.invoiceBillTo.contacts[0].phoneNumbers[0].number = phone;

            $scope.invoiceBillTo.companyInfo.contacts[0].firstName = firstName;
            $scope.invoiceBillTo.companyInfo.contacts[0].lastName = lastName;
            $scope.invoiceBillTo.name = companyName;
            $scope.invoiceBillTo.companyInfo.addresses[0].addressWithSuitNumberAndPostalCode = fullAddress
          }



        })

        $scope.openEditModal = function (type, company) {
          var templates = {
            contacts: '/html/scripts/core/billable/edit-contact-details-modal.tpl.html',
            customer: '/html/scripts/core/billable/edit-customer-modal.tpl.html'
          }

          if (type === 'customer') {
            company = CompaniesService.getCompanyByAddressId(company.id);
          }

          // console.log(company, 'COMPANY')

          $rootScope.savedCompanyId = company.id;
          $uibModal.open({
            templateUrl: templates[type],
            animation: true,
            backdrop: true,
            size: '620',
            controller: 'quicktech.core.billable.invoiceEditModalCtrl',
            resolve: {
              paymentIds: function () {
                var paymentIds = [];
                for (var id in $scope.idDictionary) {
                  if ($scope.idDictionary[id]) {
                    paymentIds.push(id);
                  }
                }
                $scope.idDictionary = {};
                return paymentIds;
              }
            }
          });
        };

        $scope.sorted = function(arr) {
          var newArr = arr.slice();
          newArr.sort(function(a, b) {
            // console.log(a, b)
            return a.title.localeCompare(b.title);
          });

          return newArr;
        }

        $scope.PermissionsService = PermissionsService;
        $scope.headerSharedState = SharedStateService.getSharedState('billableHeader');
        $scope.getLogo = $rootScope.getCompanyLogoUrl;
        $scope.loadingInProgress = true;
        $scope.ticketsSelection = {};

        $scope.expandedCompanyId = '';


        $scope.showInvoice = function() {
          $scope.isInvoiceShown = true;

          // addListeners();
        }

        // console.log('billable ctrl')

        $scope.$on('$destroy', function() {
          // console.log('billable ctrl has been destroyed')
        })

        $scope.$watch(function() {
          return $rootScope.hideInvoiceWhenBack
        }, function(val) {

          // console.log("something happen", val)
          if (val) {
            $rootScope.hideInvoiceWhenBack = false;
            $scope.isInvoiceShown = false;
          }
        })

        $scope.$watch(function() {
          return $rootScope.isInvoiceCreated;
        }, function(val) {
          if (val) {
            $rootScope.isInvoiceCreated = false;

            $scope.isInvoiceShown = false;
          }
        })

        $scope.togglePreview = function() {
          $scope.isPreviewShown = !$scope.isPreviewShown;

          // console.log($scope.ticketNote, 'note')
        }

        $scope.setExpandedCompanyId = function (companyId) {
          if (companyId === $scope.expandedCompanyId) {
            $scope.expandedCompanyId = '';
          } else {
            $scope.expandedCompanyId = companyId;
          }
        };

        $scope.isDisocuntForIcon = function (billableCompany) {
          var isDiscount = false;
          for (var t = 0; t < billableCompany.tickets.length; t++) {
            if (billableCompany.tickets[t].discountSum > 0) {
              isDiscount = true;
            }
            if (billableCompany.tickets[t].productExpense) {
              for (var m = 0; m < billableCompany.tickets[t].productExpense.length; m++) {
                if (billableCompany.tickets[t].productExpense[m].discountSum > 0) {
                  isDiscount = true;
                }
              }
            }
            if (billableCompany.tickets[t].serviceExpense) {
              for (var n = 0; n < billableCompany.tickets[t].serviceExpense.length; n++) {
                if (billableCompany.tickets[t].serviceExpense[n].discountSum > 0) {
                  isDiscount = true;
                }
              }
            }
          }
          return isDiscount;
        };

        $scope.checkAgreementTypeToShowDiscount = function (serviceExpense) {
          if (serviceExpense.item && serviceExpense.item.name) {
            if (serviceExpense.item.blockTimeServiceAgreementId == null &&
              serviceExpense.item.serviceContractServiceAgreementId == null &&
              serviceExpense.item.serviceAgreementId !== null) {
              return true
            } else {
              return false;
            }
          }
        };

        $scope.isDiscountForIconTicket = function (ticket) {
          var isTicketDiscount = false;
          if (ticket.discountSum > 0) {
            isTicketDiscount = true;
          }
          if (ticket.productExpense) {
            for (var e = 0; e < ticket.productExpense.length; e++) {
              if (ticket.productExpense[e].discountSum > 0) {
                isTicketDiscount = true;
              }
            }
          }
          if (ticket.serviceExpense) {
            for (var w = 0; w < ticket.serviceExpense.length; w++) {
              if (ticket.serviceExpense[w].discountSum > 0) {
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

        $scope.billableData = BillableService.getBillablePageDto($scope, getBillableDto);

        function getBillableDto(respData) {
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
        }

        $scope.addDiscountInBillable = function (expenseId, discountAmount) {
          var data = {};
          if (expenseId && discountAmount) {
            data = {
              expenseId: expenseId,
              discountAmount: discountAmount,
              discountType: 'PERCENT'
            };
            BillableService.saveBillableDiscount(data, function (resp) {
              console.log("saveBillableDiscount: ", resp)
            })
          }
          else {
            data = {
              expenseId: expenseId,
              discountAmount: null,
              discountType: null
            };
            BillableService.saveBillableDiscount(data, function (resp) {
              console.log(resp)
            })
          }

        };

        $scope.loadingFinished = function () {
          $scope.loadingInProgress = false;
        };

        $scope.clearAllSelections = function() {

        }

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
          var taxIds = entity.taxes.map(function (tax) {
            return tax.id
          });
          TaxesService.linkWithEntity(entity.id, entityType, taxIds);
        };






      }]);

}());
