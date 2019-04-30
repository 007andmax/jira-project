'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivableCtrl',
    ['$scope', '$state', '$stateParams', 'ReceivableService', 'CompaniesService', 'TicketsService',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService', 'quicktech.common.services.UserNotificationService', '$rootScope',
      function ($scope, $state, $stateParams, ReceivableService, CompaniesService, TicketsService, SharedStateService, PermissionsService, UserNotificationService, $rootScope) {

        var availableMods = ['group-by-company', 'list'];
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.limitValue = 20;
        $scope.offset = 0;
        $scope.invocesList = [];
        $scope.data = {
          limit: $scope.limitValue,
          offset: $scope.offset,
        };
        $scope.stopScroll = false;
        $scope.stopReqeust = false;
        $scope.invoiceNumber = null;
        $scope.companyFilterName = null;
        $scope.sortByValue = null;
        $scope.sortByItem = null;
        $scope.companies = getCompaniesNames(CompaniesService.getClientCompanies());

        function getCompaniesNames(list) {
          const filteredArray = [];
          list.map((item) => {
            filteredArray.push(item.name);
          });
          return filteredArray;
        }

        $rootScope.$on('receivableInvoice', function(event, newInvoice){
          if (newInvoice.action === 'INVOICE_DELETED') {
            $scope.invocesList = $scope.invocesList.filter((item) => item.id !==  newInvoice.data.id );
          } else if(newInvoice.action === 'PAYMENT_CREATED') {
            console.log(newInvoice, 'newInvoice');
            const index = $scope.invocesList.findIndex((item) => item.number === newInvoice.data.partialPaidInvoice);
            console.log($scope.invocesList[index], '$scope.invocesList[index]11111');
            $scope.invocesList[index].paidSum += newInvoice.data.partialPaidAmount;
            console.log($scope.invocesList[index], '$scope.invocesList[index]2222');
          } else {
            const index = $scope.invocesList.findIndex((item) => item.id === newInvoice.data.id);
            $scope.invocesList[index] = newInvoice.data;
          }
        });

        $rootScope.$on('receivableInvoicePayment', function(event, newInvoice){
          if(newInvoice.action === 'PAYMENT_CREATED') {
            console.log(newInvoice, 'newInvoice');
            const index = $scope.invocesList.findIndex((item) => item.number === newInvoice.data.partialPaidInvoice);
            console.log($scope.invocesList[index], '$scope.invocesList[index]11111');
            $scope.invocesList[index].paidSum += newInvoice.data.partialPaidAmount;
            console.log($scope.invocesList[index], '$scope.invocesList[index]2222');
          } else {
            console.log(newInvoice, 'newInvoice');
            const index = $scope.invocesList.findIndex((item) => item.id === newInvoice.data.id);
            $scope.invocesList[index] = newInvoice.data;
            $scope.invocesList[index].sum = newInvoice.data.totalSum
          }
        });


        function removeDuplicates(myArr, prop) {
          return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
          });
        }


        $scope.getInvoices = function (data) {
          console.log( $scope.offset, ' $scope.offset1');
          $scope.stopScroll = true;
          if (!data) {
            data = $scope.returnData();
          }
          if (!$scope.stopReqeust) {
            $scope.stopReqeust = true;
            ReceivableService.getInvoiceDataTable($scope, function (resp) {
              $scope.invocesList = [...$scope.invocesList, ...resp];
              $scope.invocesList = removeDuplicates($scope.invocesList, 'id');
              $rootScope.allInvoices = $scope.invocesList;
            }, data).then(() => {

              setTimeout(() => {
                $scope.isInvoiceShown = false;
                console.log($scope.offset, '$scope.offset2');
                $scope.offset += $scope.limitValue;
                $scope.stopReqeust = false;
                $scope.stopScroll = false;
              }, 800);

            });
          } else {
          }
        };

        $scope.getInvoices($scope.data);

        $scope.filterInvoicesBy = function(val) {
        };

        $scope.showInvoice = function(invoice, goBack) {
          $scope.isInvoiceShown = goBack ? false : true;

          if (goBack) {

            setTimeout(function() {
              window.scrollTo(0, 10);
              window.scrollTo(0, 0);
            }, 0)

          }
          $rootScope.invoiceToShow = invoice;
        };




        $scope.sortForReadedAtReverse = false;

        $scope.$watch('invoiceFilterCompany', function(value){
          if(value && value.length > 1) {
            $scope.resetAllFiltersForSort();
            $scope.data = $scope.returnData();
            $scope.getInvoices($scope.data);
          } else if(value === undefined) {
            $scope.resetAllFiltersForSort();
            $scope.data = $scope.returnData();
            $scope.getInvoices($scope.data);
          }
        });

        $scope.onBlurInvoice = function(invoiceNumber) {
          $scope.resetAllFiltersForSort();
          $scope.stopReqeust = false;
          $scope.offset = 0;
          $scope.invoiceNumber = invoiceNumber;
          $scope.data = $scope.returnData();
          $scope.invocesList = [];
          $scope.getInvoices($scope.data);
        };

        $scope.onKeyPressInvoice = function($event) {
          if ($event.keyCode === 13) {
            $('#inputNumber').blur();
          }
        };

        $scope.invoiceFilterCompany = '';

        $scope.PermissionsService = PermissionsService;
        $scope.mode = availableMods[1];
        $scope.orderInvoices = {
          field: 'number',
          reverse: true
        };
        $scope.totalSum = {
          companies: {},
          invoices: {}
        };
        $scope.loadingInProgress = true;
        $scope.sending = [];

        $scope.invoiceDateFilter = {startDate: null, endDate: null};

        $scope.invoiceDateFilterOptions = {
          'autoApply': true,
          "cancelClass": "btn-secondary",
          locale: {
            "format": 'D MMM YYYY'
          }
        };

        $scope.clearInvoiceDateFilter = function() {
          $scope.invoiceDateFilter =  {startDate: null, endDate: null};
          $scope.stopReqeust = false;
          $scope.invocesList = [];
          $scope.sortByItem = null;
          $scope.offset = 0;
          $scope.data = $scope.returnData();
          $scope.getInvoices($scope.data);
        };

        $scope.$watch(function() {
          return $rootScope.allInvoices && $rootScope.allInvoices.length;
        }, function (resp) {

          if (resp) {
            resp = $rootScope.uploadedReceivable;
          } else {
            return;
          }
          var invoicesData = resp;
          $rootScope.allInvoices = $scope.invocesList;

          $rootScope.receivableInvoicesData = resp;
          globalSearch.count = $rootScope.allInvoices.length;

          $scope.totalReceivables = 0;
          $scope.receivableCompanies = [];
          $scope.invoiceToSent = {};

          for (var id in invoicesData.companies) {
            var invoices = invoicesData.companies[id];
            $scope.totalSum.companies[id] = 0;

            for (var i = 0; i < invoices.length; i++) {
              var invoice = invoices[i];

              $scope.totalSum.invoices[invoice.id] = invoice.sum;
              $scope.totalSum.companies[id] += invoice.sum;
            }

            $scope.totalReceivables += $scope.totalSum.companies[id];
            $scope.receivableCompanies.push(CompaniesService.getOneById(id));
          }

          if ($scope.mode === 'group-by-company') {

            for (var companyId in invoicesData.companies) {
              $scope.invoiceToSent[companyId] = {
                checked: false,
                invoices: {}
              };
            }
          } else {
            $scope.invoiceToSent.invoices = {};
          }

          if (!resp.list.length) {
            $scope.loadingInProgress = false;
          }

        });

        $scope.$watch(function () {
          return $stateParams.mode;
        }, function (mode) {
          if (availableMods.indexOf(mode) < 0) {
            $state.go('receivable', {
              mode: availableMods[0]
            });
          } else {
            $scope.mode = mode;
          }

          $scope.headerSharedState = SharedStateService.getSharedState('receivableHeader');
        });

        $scope.changeCompanyCheckbox = function (companyId) {

          var invoiceToSentData = $scope.invoiceToSent[companyId];

          if (invoiceToSentData) {

            var invoices = $scope.receivableInvoicesData.companies[companyId];

            for (var j = 0; j < invoices.length; j++) {
              invoiceToSentData.invoices[invoices[j].number] = invoiceToSentData.checked;
            }
          }
        };

        $scope.invoiceFilterChecker = function(invoice) {
          if( $scope.invoiceFilter && $scope.invoiceFilter !== '' && $scope.invoiceFilter !== ' ') {
            return (invoice.number.indexOf($scope.invoiceFilter) > -1 || invoice.companyName.indexOf($scope.invoiceFilter) > -1)
          } else {
            return true;
          }
        };

        $scope.sortByFilterChecker = function(invoice) {
          if($scope.sortByValue === 'Paid invoices') {
            return !!invoice.paidOn;
          } else if($scope.sortByValue === 'Unpaid invoices') {
            return (invoice.isOutstanding || invoice.isOverDue) && !invoice.paidOn;
          } else if($scope.sortByValue === 'Overdue invoices') {
            return invoice.isOverDue && !invoice.paidOn
          } else {
            return true;
          }
        };

        $scope.dateFilterChecker = function(invoice) {
          if($scope.invoiceDateFilter.startDate && $scope.invoiceDateFilter.endDate) {
            var invoiceDate = new Date(invoice.date).getTime();
            var startDateFromFilter = new Date($scope.invoiceDateFilter.startDate._d).getTime();
            var endDateFromFilter = new Date($scope.invoiceDateFilter.endDate._d).getTime();
            return (invoiceDate >= startDateFromFilter && invoiceDate <= endDateFromFilter);
          } else {
            return true;
          }
        };

        $scope.filterInvoices = function(invoices) {
          return invoices.filter($scope.filteringForInvoice)
        };

        $scope.filteringForInvoice = function(invoice) {
          return $scope.invoiceFilterChecker(invoice) && $scope.sortByFilterChecker(invoice) && $scope.dateFilterChecker(invoice);
        };

        $scope.$watchGroup(['invoiceFilter'] , function(value){

          if(value && $scope.receivableInvoicesData) {
            var filteredInvoices = $scope.receivableInvoicesData.list.filter(function(invoice) {
              return $scope.filteringForInvoice(invoice);
            });
            globalSearch.count = filteredInvoices.length;
          }
        });

        $scope.$watch('invoiceDateFilter', function(value) {
          $scope.resetAllFiltersForSort();
          $scope.data = $scope.returnData();
          $scope.invoiceDateFilter = value;
          $scope.getInvoices($scope.data);
        });

        $scope.resetFilter = function() {
          $scope.stopReqeust = false;
          $scope.invocesList = [];
          $scope.companyFilterName = null;
          $scope.offset = 0;
          $scope.data = $scope.returnData();
          $scope.getInvoices($scope.data);
        };

        $scope.sortBySetItem = function(val){
          $scope.sortByValue = val.toUpperCase();
          $scope.resetFilter();

        };


        $scope.$watch(
          function() {return $scope.invoiceToSent && $scope.invoiceToSent.invoices;},
          function(val) {$scope.checkInvoicesCompany()}, true)
        $scope.checkInvoicesCompany = function() {

          if (!$scope.invoiceToSent) return;

          var invoicesNums = Object.keys($scope.invoiceToSent.invoices).reduce(function(acc, el) {
            if ($scope.invoiceToSent.invoices[el]) {
              acc.push(el);
            }

            return acc;
          }, []);

          var invoicesCompanies = invoicesNums.reduce(function(acc, el) {
            var companyId = $scope.receivableInvoicesData.list.find(function(invoice) {
              return invoice.number === el;
            });
            companyId =  companyId && companyId.company.id;
            if (!~acc.indexOf(companyId)) {
              acc.push(companyId);
            }

            return acc;
          }, []);
          $scope.areDiffCompaniesChecked = invoicesCompanies.length > 1;
          return invoicesCompanies.length > 1;
        };


        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
        };


        $scope.isAllinvoicesSelected = function() {
          if($scope.receivableInvoicesData && $scope.receivableInvoicesData.list) {
            return $scope.selectedInvoiceCount === $scope.receivableInvoicesData.list.length
          } else {
            return false;
          }
        };

        $scope.selectAllInvoices = function() {
          if($scope.selectedInvoiceCount !== $scope.receivableInvoicesData.list.length) {
            for(var i = 0; i < $scope.receivableInvoicesData.list.length; i++) {
              $scope.invoiceToSent.invoices[$scope.receivableInvoicesData.list[i].number] = true;
              $scope.selectedInvoiceCount++
            }
          } else {
            for(var invoice in $scope.invoiceToSent.invoices) {
              if($scope.invoiceToSent.invoices.hasOwnProperty(invoice)) {
                $scope.invoiceToSent.invoices[invoice] = false;
              }
            }
          }
        };

        $scope.selectedPaidInvoice = false;

        $scope.setOrderForInvoices = function (option) {
          switch(option) {
            case 'date':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'INVOICE_DATE_ASC' ? 'INVOICE_DATE_ASC' : 'INVOICE_DATE_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            case 'number':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'INVOICE_NUMBER_ASC' ? 'INVOICE_NUMBER_ASC' : 'INVOICE_NUMBER_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            case 'company':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'COMPANY_NAME_ASC'? 'COMPANY_NAME_ASC' : 'COMPANY_NAME_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            case 'readedAt':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'READ_ON_ASC' ? 'READ_ON_ASC' : 'READ_ON_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            case 'sum':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'AMOUNT_ASC' ? 'AMOUNT_ASC' : 'AMOUNT_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            case 'balance':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'BALANCE_ASC' ? 'BALANCE_ASC' : 'BALANCE_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            case 'dueDate':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'DUE_DATE_ASC' ? 'DUE_DATE_ASC' : 'DUE_DATE_DESC';
              $scope.data = $scope.returnData();
              $scope.getInvoices($scope.data);
              break;
            default:
              break;
          }
        };

        $scope.resetAllFiltersForSort = function() {
          $scope.stopReqeust = false;
          $scope.filteredPayments = [];
          $scope.invocesList = [];
          $scope.offset = 0;
        };

        $scope.returnData = function() {
          return ({
            limit: $scope.limitValue,
            offset: $scope.offset,
            invoiceNumber: $scope.invoiceNumber ? $scope.invoiceNumber : null,
            startDate: $scope.invoiceDateFilter.startDate ? new Date($scope.invoiceDateFilter.startDate).getTime() : null,
            endDate: $scope.invoiceDateFilter.endDate ? new Date($scope.invoiceDateFilter.endDate).getTime() : null,
            companyName : $scope.invoiceFilterCompany ? $scope.invoiceFilterCompany : null,
            status: $scope.sortByValue ? $scope.sortByValue.toUpperCase() : null,
            sortBy: $scope.sortByItem ? $scope.sortByItem : null
          });
        };




        $scope.$watch('invoiceToSent', function () {
          $scope.selectedPaidInvoice = false;

          $scope.selectedInvoiceCount = 0;
          var disabledCount = 0,
            invoices;

          if ($scope.mode === 'group-by-company') {

            for (var companyId in $scope.invoiceToSent) {
              var invoiceToSent = $scope.invoiceToSent[companyId],
                companyChecked = invoiceToSent.checked;

              invoices = invoiceToSent.invoices;

              if (invoices) {
                for (var invoiceNumber in invoices) {
                  if (invoices[invoiceNumber]) {
                    $scope.selectedInvoiceCount++;
                    if (!companyChecked) {
                      disabledCount++;
                      $scope.selectableCompanyId = companyId;
                    }
                  }
                }
              }

              if (companyChecked) {
                disabledCount++;
                $scope.selectableCompanyId = companyId;
              }
            }

          } else {

            if (!$scope.invoiceToSent) {
              return;
            }

            invoices = $scope.invoiceToSent.invoices;
            $scope.selectMoreThanOneCompany = false;
            for (var invoiceNumber in invoices) {
              if (invoices[invoiceNumber]) {
                $scope.selectedInvoiceCount++;
                disabledCount++;
                for (var i = 0; i < $scope.receivableInvoicesData.list.length; i++) {
                  if (invoiceNumber === $scope.receivableInvoicesData.list[i].number) {

                    if($scope.selectableCompanyId) {
                      if($scope.selectableCompanyId === $scope.receivableInvoicesData.list[i].company.id) {
                        $scope.selectableCompanyId = $scope.receivableInvoicesData.list[i].company.id
                      } else {
                        $scope.selectableCompanyId = undefined;
                        $scope.selectMoreThanOneCompany = true;
                      }
                    } else {
                      $scope.selectableCompanyId = $scope.receivableInvoicesData.list[i].company.id
                    }

                    if($scope.receivableInvoicesData.list[i].paidOn) {
                      $scope.selectedPaidInvoice = true;
                    }
                    break;
                  }
                }
              }
            }
            if( $scope.selectMoreThanOneCompany) {
              $scope.selectableCompanyId = undefined;
            }

          }

          if (disabledCount === 0) {
            $scope.selectableCompanyId = undefined;
          }
        }, true);

        $scope.sortBy = function(value) {
          $scope.sortByValue = value;
          $scope.invoiceToSent = {};
          if(value === 'Group by companies') {
            $scope.mode =  availableMods[0];
            for (var companyId in $scope.receivableInvoicesData.companies) {
              $scope.invoiceToSent[companyId] = {
                checked: false,
                invoices: {}
              };
            }
            $scope.invoiceDateFilter = {startDate: null, endDate: null};
            $scope.invoiceFilter = '';
            $scope.invoiceFilterCompany = '';
            globalSearch.count = $scope.receivableInvoicesData.list.length;
          } else {
            $scope.mode = availableMods[1];
            $scope.invoiceToSent.invoices = {};
          }
        };

        $scope.hideLoadingIndicator = function () {
          $scope.loadingInProgress = false;
        };

        $scope.filterByCompany = function (invoice) {
          return !$scope.headerSharedState.filter.companyId || invoice.company.id === $scope.headerSharedState.filter.companyId;
        };

        $scope.userReadable = function (text) {
          if (!text) {
            return '';
          }
          var words = text.split('_'),
            result = '';
          for (var i = 0, len = words.length; i < len; i++) {
            var word = words[i];
            result += word[0].toUpperCase() + word.slice(1).toLowerCase();

            if (i !== len - 1) {
              result += ' ';
            }
          }
          return result;
        };

        $scope.resendSelectedInvoices = function () {
          var invoiceIds = [],
            invoiceList = $scope.receivableInvoicesData.list;

          $scope.sendingInvoices = true;

          if ($scope.mode === 'list') {
            for (var i = 0; i < invoiceList.length; i++) {
              if ($scope.invoiceToSent.invoices[invoiceList[i].number]) {
                invoiceIds.push(invoiceList[i].id);
                $scope.invoiceToSent.invoices[invoiceList[i].number] = false;
              }
            }
          } else {
            for (var companyId in $scope.invoiceToSent) {
              var invoices = $scope.invoiceToSent[companyId].invoices;

              for (var i = 0; i < invoiceList.length; i++) {
                if (invoices[invoiceList[i].number]) {
                  invoiceIds.push(invoiceList[i].id);
                  invoices[invoiceList[i].number] = false;
                }
              }
            }
          }

          var notificationMessage = invoiceIds.length > 1 ? 'Invoices have' : 'The invoice has';

          ReceivableService.resendInvoices(invoiceIds, function () {
            $scope.sendingInvoices = false;
            UserNotificationService.show(notificationMessage + ' been sent', true);
          });
        };

      }]);

}());
