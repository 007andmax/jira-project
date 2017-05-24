'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceCtrl',
    [
      '$scope', 'RecurringService', 'CompaniesService', 'ServicesService', '$filter', 'UsersService',
      'ProductsService', 'EmailSettingsService', '$timeout', 'TicketsService', 'Utils',
      'quicktech.common.services.UserConfirmationsService',
      function ($scope, RecurringService, CompaniesService, ServicesService, $filter, UsersService,
                ProductsService, EmailSettingsService, $timeout, TicketsService, Utils,
                UserConfirmationsService) {

        var day = 1000 * 60 * 60 * 24, form,
          allClientUsers = UsersService.getClientUsers();

        $scope.clients = [];
        $scope.frequency = {
          cod: 'COD',
          sevenDays: '7 days',
          fifteenDays: '15 days',
          thirtyDays: '30 days',
          MONTHLY: 'Month',
          YEARLY: 'Year'
        };
        $scope.openTab = 'product';

        $scope.repeatingPattern = /^(\d?[0-9]{0,17})?(Month)?(Year)?$/;
        $scope.numToGeneratePattern = /^\d{0,3}$/;
        $scope.savedRepeatingInvoice = '';
        $scope.disabledSaveInvoice = true;
        $scope.reInitEndDate = true;
        $scope.searchCompany = '';
        $scope.paramInvocie = {
          paymentTerms: '',
          repeatingInvoice: '',
          remainGenerations: ''
        };
        $scope.tryAddExpense = {
          tryToAddProduct: false,
          tryToAddService: false
        };
        $scope.selectUpdateSharedUser = {};
        $scope.minSentOnDate = $filter('date')(new Date(Date.now() + day), 'dd MMM yyyy');

        $scope.companies = CompaniesService.getClientCompanies();
        $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);

        if ($scope.invoice && $scope.invoice.id) {
          form = true;
          $scope.repeatingInvoiceModel = true;

          $scope.searchCompany = CompaniesService.getOneById($scope.invoice.company.id).name;
          $scope.actualInvoiceNumber = $scope.invoice.number;
          $scope.minEndDate = new Date($scope.invoice.endDate);
          $scope.ticketSharedUsersList = [];

          $timeout(function () {
            if ($scope.invoice.shares) {
              $scope.ticketSharedUsersList = $scope.invoice.shares.map(function (share) {
                return { user: share.user, notify: true };
              });

              for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
                var share = $scope.ticketSharedUsersList[i];
                $scope.selectUpdateSharedUser[share.user.id] = true;
              }
            }
          });
          $scope.minSentOnDate = $filter('date')(new Date($scope.invoice.nextGenerationAt), 'dd MMM yyyy');

          $scope.editInvoice = {
            id: $scope.invoice.id,
            company: {
              id: $scope.invoice.company.id
            },
            title: $scope.invoice.title,
            autoCreate: $scope.invoice.autoCreate,
            purchaseOrder: $scope.invoice.purchaseOrder,
            paymentTerms: $scope.invoice.paymentTerms,
            memo: $scope.invoice.memo,
            nextGenerationAt: $filter('date')(new Date($scope.invoice.nextGenerationAt), 'dd MMM yyyy'),
            endDate: $filter('date')(new Date($scope.invoice.endDate), 'dd MMM yyyy'),
            products: $scope.invoice.products.length ? angular.copy($scope.invoice.products) : [{}],
            services: $scope.invoice.services.length ? angular.copy($scope.invoice.services) : [{}]
          };

          for (var i = 0, len = $scope.editInvoice.services.length; i < len; i++) {
            if ($scope.editInvoice.services[i].quantity) {
              $scope.editInvoice.services[i].quantity = ( $scope.editInvoice.services[i].quantity * 60);
            }
            if ($scope.editInvoice.services[i].date !== undefined) {
              $scope.editInvoice.services[i].date = $filter('date')(new Date($scope.editInvoice.services[i].date), 'dd MMM yyyy');
            } else {
              $scope.editInvoice.services[i].date = $filter('date')(new Date(), 'dd MMM yyyy');
            }
          }

          if ($scope.invoice.frequency) {
            $scope.paramInvocie.repeatingInvoice = $scope.invoice.frequency === 'MONTHLY' ? 'Month' : 'Year';
          } else {
            $scope.paramInvocie.repeatingInvoice = $scope.invoice.customFrequency;
          }

          $timeout(function () {
            $scope.paramInvocie.paymentTerms = $scope.invoice.paymentTerms === 0 ? $scope.invoice.paymentTerms : ($scope.invoice.paymentTerms + ' days');
            $timeout(function () {
              $scope.editInvoice.nextGenerationAt = $filter('date')(new Date($scope.invoice.nextGenerationAt), 'dd MMM yyyy');
              $scope.minSentOnDate = $filter('date')(new Date($scope.invoice.nextGenerationAt), 'dd MMM yyyy');
              $scope.editInvoice.endDate = $filter('date')(new Date($scope.invoice.endDate), 'dd MMM yyyy');
              $scope.paramInvocie.remainGenerations = $scope.invoice.remainGenerations;
            });
          });

        } else {

          $scope.ticketSharedUsersList = [];

          $scope.minEndDate = new Date(Date.now() + day);

          TicketsService.getActualNumber($scope, function (number) {
            $scope.actualInvoiceNumber = number;
          });

          var tomorrow = $filter('date')(new Date(Date.now() + day), 'dd MMM yyyy');
          $scope.editInvoice = {
            autoCreate: true,
            products: [{}],
            services: [{}],
            nextGenerationAt: tomorrow,
            endDate: tomorrow
          };

          EmailSettingsService.getTermsAndConditions(function (invoiceInfo) {
            $scope.paramInvocie.paymentTerms = invoiceInfo.term + ' days';
            $scope.editInvoice.paymentTerms = invoiceInfo.term;
          });

        }

        $scope.$watch('currentUser.permissions', function (permissions) {
          if (permissions && !$scope.PermissionsService.isAllowed('CREATE_INVOICE')) {
            $scope.toogleEditForm();
          }
        });

        $scope.setDisabledSaveInvoice = function (value) {
          $scope.disabledSaveInvoice = !!value;
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSaveInvoice || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.getErrorMessage = function (form) {
          if (form && $scope.triedToSaveInvoice) {
            var error = Object.keys(form.$error);

            if (error.indexOf("required") !== -1) {

              for (var i = 0, len = form.$error.required.length; i < len; i++) {

                if (form.$error.required[i].$name.indexOf('updateInvoiceProduct') !== -1) {
                  if ($scope.tryAddExpense.tryToAddProduct) {
                    return 'Required fields cannot be left empty.';
                  }

                } else if (form.$error.required[i].$name.indexOf('updateInvoiceService') !== -1) {
                  if ($scope.tryAddExpense.tryToAddService) {
                    return 'Required fields cannot be left empty.';
                  }

                } else {
                  return 'Required fields cannot be left empty.';
                }
              }
            } else if (error && error.length > 0) {
              return 'Form is not valid.';
            }

            if ($scope.disabledSaveInvoice) {
              return 'Order must have expense.'
            }

          }
        };

        $scope.chooseCompany = function (company) {
          $scope.clients.splice(0, $scope.clients.length);
          resetSharedUsers(company);

          var today = $filter('date')(new Date(), 'dd MMM yyyy');
          if (!company) {
            delete $scope.editInvoice.company;
            delete $scope.companyServices;
            $scope.editInvoice.services = [{ date: today }];
            Utils.customizeArray(allClientUsers, $scope.clients);
            return;
          }

          Utils.customizeArray(UsersService.getAllByCompanyId(company.id), $scope.clients);

          $scope.searchCompany = company.name;
          $scope.editInvoice.company = {
            id: company.id
          };

          if ($scope.invoice && $scope.invoice.id && company.id === $scope.invoice.company.id) {
            $scope.editInvoice.services = $scope.invoice.services.length ? angular.copy($scope.invoice.services) : [{}];

            for (var i = 0, len = $scope.editInvoice.services.length; i < len; i++) {
              if ($scope.editInvoice.services[i].quantity) {
                $scope.editInvoice.services[i].quantity = ( $scope.editInvoice.services[i].quantity * 60);
              }
              if ($scope.editInvoice.services[i].date !== undefined) {
                $scope.editInvoice.services[i].date = $filter('date')(new Date($scope.editInvoice.services[i].date), 'dd MMM yyyy');
              } else {
                $scope.editInvoice.services[i].date = today;
              }
            }
          } else {
            $scope.editInvoice.services = [{ date: today }];
          }

          $scope.companyServices = ServicesService.getAllByCompany($scope, company.id);
        };

        $scope.$watch('searchCompany', function (val) {
          if (!val) {
            $scope.chooseCompany();
            return;
          }

          $scope.editInvoiceForm.customer && $scope.editInvoiceForm.customer.$pristine && $scope.editInvoiceForm.customer.$setDirty();

          for (var i = 0, len = $scope.companies.length; i < len; i++) {
            if (val.toLowerCase() === $scope.companies[i].name.toLowerCase()) {
              $scope.chooseCompany($scope.companies[i]);
              return;
            }
          }

          $scope.chooseCompany();
        });

        $scope.setPaymentTerms = function (value) {
          $scope.paramInvocie.paymentTerms = value;
        };

        $scope.$watch('paramInvocie.paymentTerms', function (val) {
          if (val && $scope.editInvoiceForm && $scope.editInvoiceForm.paymentTerms && $scope.editInvoiceForm.paymentTerms.$pristine) {
            $scope.editInvoiceForm.paymentTerms.$setDirty();
          }
          $scope.editInvoice.paymentTerms = parseInt(val) || 0;
        });

        $scope.changeRepeatInvoice = function () {
          changeRepeatAndStart();
        };

        $scope.changeStartDate = function () {
          if (form) {
            form = false;
            return;
          }
          changeRepeatAndStart();
        };

        $scope.setRepeatingInvoice = function (value) {
          var parsed = parseInt(value);
          if (parsed) {
            $scope.paramInvocie.repeatingInvoice = parsed;
          } else {
            $scope.paramInvocie.repeatingInvoice = value;
          }
          $scope.changeRepeatInvoice();
        };

        $scope.saveAndClear = function () {
          $scope.savedRepeatingInvoice = $scope.paramInvocie.repeatingInvoice;
          $scope.paramInvocie.repeatingInvoice = '';
        };

        $scope.hasGeneratedInvoices = function (sentOn) {
          return (new Date(sentOn)).getTime() <= Date.now();
        };

        $scope.isNumber = function (value) {
          return parseInt(value);
        };

        function changeRepeatAndStart() {
          var val = [$scope.paramInvocie.repeatingInvoice, $scope.editInvoice.nextGenerationAt];

          if (!(val[0] && val[1])) {
            $scope.disabledEndAndNum = true;
            return;
          }
          $scope.disabledEndAndNum = false;

          var repeat = val[0];
          var startDay = val[1];
          var numToGenerate = ($scope.paramInvocie.remainGenerations || 1) - 1;
          var endDay = new Date(startDay);

          if ($scope.editInvoiceForm.repeatingInvoice && $scope.editInvoiceForm.repeatingInvoice.$pristine) {
            $scope.editInvoiceForm.repeatingInvoice.$setDirty();
          }

          if (repeat === 'Month') {
            $scope.repeatingInvoiceModel = true;
            endDay.setMonth(startDay.getMonth() + numToGenerate);
          } else if (repeat === 'Year') {
            $scope.repeatingInvoiceModel = true;
            endDay.setFullYear(startDay.getFullYear() + numToGenerate);
          } else if (parseInt(repeat) > 0) {
            $scope.repeatingInvoiceModel = true;
            endDay.setDate(startDay.getDate() + repeat * numToGenerate);
          } else {
            $scope.repeatingInvoiceModel = undefined;
            endDay = undefined
          }

          endDay = $filter('date')(endDay, 'dd MMM yyyy');

          $scope.minEndDate = endDay;
          $scope.editInvoice.endDate = endDay;
          reInitEndDate();
        }

        $scope.changeNumToGenerate = function () {
          var val = $scope.paramInvocie.remainGenerations;

          if (!$scope.numToGeneratePattern.test(val) || val === '') {
            return;
          }

          if (!(val && $scope.paramInvocie.repeatingInvoice && $scope.editInvoice.nextGenerationAt)) {
            return;
          }

          if (+val === 0) {
            $scope.clearEndDate();
            return;
          }

          setEndAndNum('endDate');
        };

        $scope.changeEndDate = function () {
          var val = $scope.editInvoice.endDate;

          if (!val) {
            $scope.paramInvocie.remainGenerations = undefined;
            return;
          }
          if (!($scope.paramInvocie.repeatingInvoice && $scope.editInvoice.nextGenerationAt)) {
            return;
          }

          setEndAndNum('num');
        };

        function setEndAndNum(option) {
          var repeat = $scope.paramInvocie.repeatingInvoice;
          var sentOn = new Date($filter('date')($scope.editInvoice.nextGenerationAt, 'dd MMM yyyy'));

          if (option === 'endDate') {
            var endDate = new Date(sentOn);
            var num = parseInt($scope.paramInvocie.remainGenerations) - 1;

            if (repeat === 'Month') {
              endDate.setMonth(sentOn.getMonth() + num);
            } else if (repeat === 'Year') {
              endDate.setFullYear(sentOn.getFullYear() + num);
            } else if (parseInt(repeat) > 0) {
              endDate = +(new Date(sentOn)) + (parseInt(repeat) * day * num);
            } else {
              console.error('Unsupported Repeating Invoice every')
            }

            endDate = $filter('date')(endDate, 'dd MMM yyyy');
            $scope.editInvoice.endDate = endDate;

          } else if (option === 'num') {
            var endDate = new Date($scope.editInvoice.endDate);
            var newNum;

            if (repeat === 'Month') {
              newNum = numOfMonth(sentOn, endDate) + 1;
            } else if (repeat === 'Year') {
              newNum = numOfYear(sentOn, endDate) + 1;
            } else if (parseInt(repeat) > 0) {
              newNum = Math.round((+endDate - +sentOn) / (parseInt(repeat) * day)) + 1;
            } else {
              console.error('Unsupported Repeating Invoice every')
            }

            $scope.paramInvocie.remainGenerations = newNum;
          }
        }

        $scope.clearEndDate = function () {
          $scope.editInvoice.endDate = undefined;
          $scope.changeEndDate();
        };

        function numOfMonth(sentOn, endDate) {
          var sentOn = new Date(sentOn);
          var endDate = new Date(endDate);
          var count = 0;

          setCount();

          return count

          function setCount() {
            sentOn = new Date(sentOn.setMonth(sentOn.getMonth() + 1));

            if (+sentOn <= +endDate) {
              count++;
              setCount();
            }
          }
        }

        function numOfYear(sentOn, endDate) {
          var sentOn = new Date(sentOn);
          var endDate = new Date(endDate);
          var count = 0;

          setCount();

          return count;

          function setCount() {
            sentOn = new Date(sentOn.setFullYear(sentOn.getFullYear() + 1));

            if (+sentOn <= +endDate) {
              count++;
              setCount();
            }
          }
        }

        function reInitEndDate() {
          $scope.reInitEndDate = false;
          $timeout(function () {
            $scope.reInitEndDate = true;
          }, 0);
        }

        $scope.saveInvoice = function (form) {
          var productsEmpty = false, servicesEmpty = false;

          if ($scope.editInvoice.services.length === 1 && isEmpty($scope.editInvoice.services[0])) {
            $scope.editInvoice.services.splice(0, 1);
            servicesEmpty = true;
          }

          if ($scope.editInvoice.products.length === 1 && isEmpty($scope.editInvoice.products[0])) {
            $scope.editInvoice.products.splice(0, 1);
            productsEmpty = true;
          }

          $timeout(function () {
            if (form.$valid && !$scope.disabledSaveInvoice && $scope.isStartDateValid() &&
              (!$scope.editInvoice.autoCreate || $scope.hasNotifyRecipients($scope.ticketSharedUsersList))) {
              $scope.hardDisabledSave = true;

              var editInvoice = angular.copy($scope.editInvoice);

              if (!$scope.paramInvocie.repeatingInvoice && $scope.savedRepeatingInvoice) {
                $scope.paramInvocie.repeatingInvoice = $scope.savedRepeatingInvoice;
              }

              if ($scope.paramInvocie.remainGenerations != null) {
                editInvoice.remainGenerations = $scope.paramInvocie.remainGenerations;
              }

              if ($scope.paramInvocie.repeatingInvoice === 'Month' || $scope.paramInvocie.repeatingInvoice === 'Year') {
                editInvoice.frequency = $scope.paramInvocie.repeatingInvoice === 'Month' ? 'MONTHLY' : 'YEARLY'
              } else {
                editInvoice.customFrequency = parseInt($scope.paramInvocie.repeatingInvoice)
              }

              editInvoice.endDate = null;
              editInvoice.nextGenerationAt = $filter('date')(new Date(editInvoice.nextGenerationAt), 'yyyy/MM/dd');

              for (var i = 0, len = editInvoice.services.length; i < len; i++) {
                editInvoice.services[i].quantity = (editInvoice.services[i].quantity / 60);
                editInvoice.services[i].date = Date.parse(editInvoice.services[i].date);
              }

              editInvoice.shares = [];
              for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {

                var ticketSharedUser = $scope.ticketSharedUsersList[i];

                if (!ticketSharedUser.notify) {
                  continue;
                }

                editInvoice.shares.push({
                  user: { id: ticketSharedUser.user.id }
                });
              }

              RecurringService.saveRecurringOrder(editInvoice, function () {
                $scope.toogleEditForm();
                $scope.hardDisabledSave = false;
              })
            } else {
              if (!productsEmpty) {
                $scope.tryAddExpense.tryToAddProduct = true;
              }
              if (!servicesEmpty) {
                $scope.tryAddExpense.tryToAddService = true;
              }
              $scope.triedToSaveInvoice = true;
              $scope.hardDisabledSave = false;

              for (var i = 0; form['updateInvoiceProduct-' + i] || form['updateInvoiceService-' + i]; i++) {
                var productForm = form['updateInvoiceProduct-' + i],
                  serviceForm = form['updateInvoiceService-' + i];

                if (productForm && productForm.$invalid && $scope.openTab !== 'product') {
                  $scope.openTab = 'product';
                } else if (serviceForm && serviceForm.$invalid && $scope.openTab !== 'service') {
                  $scope.openTab = 'service';
                }
              }
            }

            if (servicesEmpty) {
              $scope.editInvoice.services.push({ date: $filter('date')(new Date(), 'dd MMM yyyy') });
            }

            if (productsEmpty) {
              $scope.editInvoice.products.push({});
            }
          })
        };

        $scope.setOpenedTab = function (tab) {
          $scope.openTab = tab;
        };

        $scope.isTabOpened = function (tab) {
          return $scope.openTab === tab;
        };

        $scope.getUserById = function (userId) {
          return UsersService.getOneById(userId);
        };

        $scope.toggleAllShared = function (isNotifyAll) {
          var sharesWithoutSubscription = [];
          for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {
            var share = $scope.ticketSharedUsersList[i];
            if (!isNotifyAll) {
              share.notify = isNotifyAll;
            } else {
              if ((share.user.subscription && share.user.subscription.invoice) || share.user.accountType === 'TECH') {
                share.notify = isNotifyAll;
              } else {
                sharesWithoutSubscription.push(share);
              }
            }
          }

          if (sharesWithoutSubscription.length > 1) {
            UserConfirmationsService
              .show(sharesWithoutSubscription.length + ' users have disabled invoice updates subscription. Do you still want to notify them?', 'Yes')
              .then(function () {
                for (var i = 0; i < sharesWithoutSubscription.length; i++) {
                  var share = sharesWithoutSubscription[i];
                  share.notify = true;
                }
              });
          } else if (sharesWithoutSubscription.length) {
            $scope.validateNotifying(sharesWithoutSubscription.pop());
          }
        };

        $scope.hasNotifyRecipients = function (shares) {
          return shares.some(function (share) {
            return share.notify;
          });
        };

        $scope.validateNotifying = function (share, event) {
          if (!share.notify && share.user.accountType !== 'TECH' && (!share.user.subscription || !share.user.subscription.invoice)) {
            UserConfirmationsService
              .show($scope.getUserName(share.user) + ' has disabled invoice updates subscription. Do you still want to notify this user?', 'Yes')
              .then(function () {
                share.notify = true;
              });
            event && event.stopPropagation();
          }
        };

        $scope.isStartDateValid = function () {
          var nextGenerationAt = new Date($scope.editInvoice.nextGenerationAt).getTime();
          return nextGenerationAt > Date.now();
        };

        $scope.$on('createNewEntity', function (event, type) {
          if (type.toString().toLowerCase() === 'company') {
            var unsubscribe = $scope.$on('newCompanyHasBeenCreated',
              function (e, id) {
                var company = CompaniesService.getOneById(id) || {};
                $scope.searchCompany = company.name;
                unsubscribe();
              });
          }
        });

        function resetSharedUsers(company) {
          var usersWithInvoiceSubscription = [];

          if (company) {
            usersWithInvoiceSubscription = UsersService.getAllByCompanyId(company.id).filter(function (user) {
              return user.subscription && user.subscription.invoice;
            });
          }

          for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
            var shares = $scope.ticketSharedUsersList[i];

            if (shares.user && UsersService.getOneById(shares.user.id).accountType !== 'TECH') {
              $scope.ticketSharedUsersList.splice(i, 1);
              $scope.selectUpdateSharedUser[shares.user.id] = false;
              i--;
            }
          }

          for (var j = 0; j < usersWithInvoiceSubscription.length; j++) {
            var user = usersWithInvoiceSubscription[j];
            $scope.ticketSharedUsersList.push({ user: user, notify: true });
            $scope.selectUpdateSharedUser[user.id] = true;
          }
        }

        function isEmpty(object) {
          for (var prop in object) {
            if (object.hasOwnProperty(prop) && prop !== 'itemOrder' && prop !== 'date' && prop !== '$$hashKey') {
              var item = object[prop];

              if (typeof item === 'object') {
                if (!isEmpty(item)) {
                  return false;
                }
              } else if (item) {
                return false;
              }
            }
          }

          return true;
        }

      }
    ]);

}());
