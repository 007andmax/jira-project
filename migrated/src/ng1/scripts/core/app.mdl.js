'use strict';

(function () {

  var app = angular.module('quicktech',
    [
      'main.services',
      'quicktech.core.tickets',
      'quicktech.common.services',
      'quicktech.common.directives',
      'quicktech.core.companies',
      'quicktech.core.products',
      'quicktech.core.billable',
      'quicktech.core.leftPanel',
      'quicktech.core.rightPanel',
      'quicktech.core.settings',
      'quicktech.core.devices',
      'quicktech.core.reports',
      'quicktech.core.serviceAgreements',
      'ui.router',
      'ui.select',
      'ui.bootstrap',
      'ngSanitize',
      'ngMessages',
      'ngAnimate',
      'LocalStorageModule',
      'ngCropper',
      'nvd3',
      'vs-repeat',
      'daterangepicker',
      'infinite-scroll'

    ]);


  app.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', '$animateProvider', '$provide',
    function ($stateProvider, $urlRouterProvider, localStorageServiceProvider, $animateProvider, $provide) {

      $provide.decorator('$rootScope', ['$delegate', '$exceptionHandler',
        function ($delegate, $exceptionHandler) {
          var proto = Object.getPrototypeOf($delegate);
          var originalDigest = proto.$digest, originalApply = proto.$apply;
          proto.$digest = function () {
            if ($delegate.$$phase === '$digest' || $delegate.$$phase === '$apply') return;
            originalDigest.call(this);
          };
          proto.$apply = function (fn) {
            if ($delegate.$$phase === '$digest' || $delegate.$$phase === '$apply') {
              try {
                this.$eval(fn);
              } catch (e) {
                $exceptionHandler(e);
              }
            } else {
              originalApply.call(this, fn);
            }
          };
          return $delegate;
        }
      ]);

      $animateProvider.classNameFilter(/angular-animate/);

      localStorageServiceProvider
        .setPrefix('quicktech')
        .setNotify(false, false);

      $urlRouterProvider.otherwise(getUserDefaultPage);
      $urlRouterProvider.when('/accounting', '/accounting/billable');

      $stateProvider
        .state('password-manager', waitForServices({
          url: '/ng2/password-manager',
          template: '<password-manager></password-manager>'
        }))
        .state('company-password-manager', waitForServices({
          url: '/ng2/company/password-manager',
          template: '<company-password-manager></company-password-manager>'
        }))
        .state('company-contracts', waitForServices({
          url: '/ng2/company/contracts',
          template: '<company-contracts-component></company-contracts-component>'
        }))
        .state('company-user', waitForServices({
          url: '/ng2/company/user',
          template: '<company-user></company-user>'
        }))
        .state('company-tickets', waitForServices({
          url: '/ng2/company/tickets',
          template: '<company-tickets></company-tickets>'
        }))
        .state('company-dashboard', waitForServices({
          url: '/ng2/company/dashboard/:companyId',
          template: '<company-dashboard></company-dashboard>'
        }))
        .state('inventory', waitForServices({
          url: '/ng2/inventory/products',
          template: '<inventory-component></inventory-component>'
        }))
        .state('new-tickets-dashboard', waitForServices({
          url: '/ng2/tickets-dashboard',
          template: '<tickets-dashboard-component></tickets-dashboard-component>'
        }))
        .state('quotes-component', {
          url: '/ng2/quotes',
          template: '<quotes-component></quotes-component>'
        })
        .state('quote-create-component', {
          url: '/ng2/quotes/quote-create',
          params: {
            editMode: null
          },
          template: '<quote-create-component></quote-create-component>'
        })
        .state('quote-preview-component', {
          url: '/ng2/quotes/quote-preview',
          params: {
            editMode: null,
            editable: null
          },
          template: '<quote-preview-component></quote-preview-component>'
        })
        .state('recurring-tickets', waitForServices({
          url: '/ng2/recurring-tickets',
          template: '<recurring-tickets-component></recurring-tickets-component>'
        }))
        .state('new-companies', waitForServices({
          url: '/ng2/companies',
          template: '<companies-component></companies-component>'
        }))
        .state('new-tickets', waitForServices({
          url: '/ng2/tickets',
          template: '<tickets-component></tickets-component>'
        }))
        .state('company-products', waitForServices({
          url: '/ng2/company/products',
          template: '<company-products></company-products>'
        }))
        .state('new-users', waitForServices({
          url: '/ng2/users',
          template: '<users-component></users-component>'
        }))
        .state('new-billable', waitForServices({
          url: '/ng2/billable',
          template: '<billable-component></billable-component>'
        }))
        .state('new-billable-tickets', waitForServices({
          url: '/ng2/billable-tickets',
          template: '<billable-tickets-component></billable-tickets-component>'
        }))
        .state('new-payments-ng2', waitForServices({
          url: '/ng2/payments',
          template: '<payments-component></payments-component>'
        }))
        .state('new-billable-invoices', waitForServices({
          url: '/ng2/invoices',
          template: '<invoices-component></invoices-component>'
        }))
        .state('new-reports', waitForServices({
          url: '/ng2/reports',
          template: '<reports-component></reports-component>'
        }))
        .state('new-item-report', waitForServices({
          url: '/ng2/report/:ticketId',
          params: {
            ticketId: '',
            remoteParams: null
          },
          template: '<item-report-component></item-report-component>'
        }))
        .state('byProducts', waitForServices({
          url: '/ng2/report/byProducts',
          template: '<item-report-component></item-report-component>'
        }))
        .state('detailed-commissions', waitForServices({
          url: '/ng2/report/detailed-commissions',
          template: '<item-report-component></item-report-component>'
        }))
        .state('common-commissions', waitForServices({
          url: '/ng2/report/common-commissions',
          template: '<item-report-component></item-report-component>'
        }))
        .state('software-summary', waitForServices({
          url: '/ng2/report/software-summary',
          template: '<item-report-component></item-report-component>'
        }))
        .state('byCustomers', waitForServices({
          url: '/ng2/report/byCustomers',
          template: '<item-report-component></item-report-component>'
        }))
        .state('byTaxes', waitForServices({
          url: '/ng2/report/byTaxes',
          template: '<item-report-component></item-report-component>'
        }))
        .state('accounts-receivable', waitForServices({
          url: '/ng2/report/accounts-receivable',
          template: '<item-report-component></item-report-component>'
        }))
        .state('accounting-report', waitForServices({
          url: '/ng2/report/accounting-report',
          template: '<item-report-component></item-report-component>'
        }))
        .state('hardware-summary', waitForServices({
          url: '/ng2/report/hardware-summary',
          template: '<item-report-component></item-report-component>'
        }))
        .state('tech-service', waitForServices({
          url: '/ng2/report/tech-service',
          template: '<item-report-component></item-report-component>'
        }))
        .state('ticket-report', waitForServices({
          url: '/ng2/report/ticket-report',
          template: '<item-report-component></item-report-component>'
        }))
        .state('service-report', waitForServices({
          url: '/ng2/report/service-report',
          template: '<item-report-component></item-report-component>'
        }))
        .state('income-accounts', waitForServices({
          url: '/ng2/report/income-accounts',
          template: '<item-report-component></item-report-component>'
        }))
        .state('accounting', waitForServices({
          url: '/accounting',
          template: '<div ui-view></div>',
          redirectTo: 'accounting.dashboard'
        }))
        .state('new-services', waitForServices({
          url: '/ng2/default-services',
          template: '<default-services-component></default-services-component>'
        }))
        .state('new-contracts', waitForServices({
          url: '/ng2/contracts',
          template: '<contracts-component></contracts-component>'
        }))
        .state('credits', waitForServices({
          url: '/accounting/credits',
          templateUrl: '/ng1/scripts/core/billable/credits/credits.tpl.html',
          controller: 'quicktech.core.billable.creditsCtrl'
        }))
        .state('new-payments', waitForServices({
          url: '/accounting/new-payments',
          templateUrl: '/ng1/scripts/core/billable/new-payments/new-payments.tpl.html',
          controller: 'quicktech.core.billable.newPaymentsCtrl'
        }))
        .state('new-quickSupport', waitForServices({
          url: '/ng2/quickSupport',
          template: '<support-component></support-component>'
        }))
        .state('reports', waitForServices({
          url: '/reports',
          templateUrl: '/ng1/scripts/core/reports/reports.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('remoteAccess', waitForServices({
          url: '/reports/remoteAccess',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/remote-access-summary.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('techReport-TicketCreated', waitForServices({
          url: '/reports/techReport-TicketCreated',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/tech-report-ticked-created.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('commissionsReport-detailed', waitForServices({
          url: '/reports/byCommissionsDetailed',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/commissions-report-detailed.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('commissionsReport-common', waitForServices({
          url: '/reports/byCommissions',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/commissions-report-common.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('techReport-ProductSales', waitForServices({
          url: '/reports/techReport-ProductSales',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/tech-report-product-sales.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('hardware-reports', waitForServices({
          url: '/reports/hardware-reports',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/hardware-summary.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('device-ip-summary', waitForServices({
          url: '/reports/device-ip-summary',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/device-ip-summary.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('myprofile-component', waitForServices({
          url: '/ng2/setting/myprofile',
          template: '<myprofile-component></myprofile-component>'
        }))
        .state('manage-tags-component', waitForServices({
          url: '/ng2/setting/tags',
          template: '<manage-tags-component></manage-tags-component>'
        }))
        .state('company-profile-component', waitForServices({
          url: '/ng2/setting/companyprofile',
          template: '<company-profile-component></company-profile-component>'
        }))
        .state('tech-component', waitForServices({
          url: '/ng2/setting/techUsers',
          template: '<tech-component></tech-component>'
        }))
        .state('company-devices', waitForServices({
          url: '/ng2/company/devices',
          template: '<company-devices-component></company-devices-component>'
        }))
        .state('email-setting-component', waitForServices({
          url: '/ng2/setting/emailSetting',
          template: '<email-setting-component></email-setting-component>'
        }))
        .state('taxes-component', waitForServices({
          url: '/ng2/setting/taxes',
          template: '<taxes-settings-component></taxes-settings-component>'
        }))
        .state('permission-manage-component', waitForServices({
          url: '/ng2/setting/permission',
          template: '<permission-manage-component></permission-manage-component>'
        }))
        .state('email-templete-component', waitForServices({
          url: '/ng2/setting/emailTemplete',
          template: '<email-templete-component></email-templete-component>'
        }))
        .state('integrations-component', waitForServices({
          url: '/ng2/setting/integration',
          template: '<integrations-component></integrations-component>'
        }))
        .state('invoice-ticket-component', waitForServices({
          url: '/ng2/setting/invoiceTickets',
          template: '<invoice-ticket-component></invoice-ticket-component>'
        }))
        .state('commission-component', waitForServices({
          url: '/ng2/setting/commission',
          template: '<commission-component></commission-component>'
        }))
        .state('subscription-component', waitForServices({
          url: '/ng2/setting/subscription',
          template: '<subscription-component></subscription-component>'
        }))
        .state('glnumber-component', waitForServices({
          url: '/ng2/setting/glnumber',
          template: '<glnumber-settings-component></glnumber-settings-component>'
        })).state('device-dashboard', waitForServices({
          url: '/ng2/device/dashboard/:type/:id',
          template: '<dashboard-component></dashboard-component>'
        }))
        .state('device-hardware', waitForServices({
          url: '/ng2/device/hardware/:type/:id',
          template: '<hardware-component></hardware-component>'
        }))
        .state('device-software', waitForServices({
          url: '/ng2/device/software/:type/:id',
          template: '<software-component></software-component>'
        }))
        .state('device-service', waitForServices({
          url: '/ng2/device/service',
          template: '<services-component></services-component>'
        }))
        .state('device-antivirus', waitForServices({
          url: '/ng2/device/antivirus',
          template: '<antivirus-component></antivirus-component>'
        }))
        .state('device-terminal', waitForServices({
          url: '/ng2/device/terminal/:type/:id',
          template: '<terminal-component></terminal-component>'
        }))
        .state('device-password', waitForServices({
          url: '/ng2/device/password',
          template: '<password-component></password-component>'
        }))
        .state('device-windows', waitForServices({
          url: '/ng2/device/windows',
          template: '<windows-component></windows-component>'
        }))
        .state('device-startup', waitForServices({
          url: '/ng2/device/startup',
          template: '<startup-component></startup-component>'
        }))
        .state('device-file', waitForServices({
          url: '/ng2/device/file',
          template: '<file-component></file-component>'
        }))
        .state('company-network-scan', waitForServices({
          url: '/ng2/company/network-scan',
          template: '<company-network-scan-component></company-network-scan-component>'
        }))
        .state('billing-dashboard', waitForServices({
          url: '/ng2/billing-dashboard',
          template: '<dashboard-billing-component></dashboard-billing-component>'
        }));

      function waitForServices(conf) {
        if (!conf.resolve) {
          conf.resolve = {};
        }

        conf.resolve.waitForServicesInitialization = ['$q', 'UsersService', '$rootScope', function ($q, UsersService, $rootScope) {

          var def = $q.defer();
          UsersService._addInitListener(function () {
            def.resolve();
            $rootScope.servicesLoaded = true;
            if ($rootScope.currentUserLoaded) {
              $rootScope.applicationLoaded = true;
            }
          });

          return def.promise;
        }];
        return conf;
      }


    }]);

  app.run(
    ['$rootScope', '$templateRequest', 'CompaniesService', '$state', '$uibModal', 'TicketsService', '$stateParams',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.SharedStateService', '$http',
      function ($rootScope, $templateRequest, CompaniesService, $state, $uibModal, TicketsService, $stateParams,
        UserConfirmationsService, SharedStateService, $http) {

        $rootScope.debounce = function (fn, time) {
          var isCalled = false;
          var interval;

          return function () {
            var args = arguments;
            if (!isCalled) {
              isCalled = true;
              fn.apply(this, args);

              interval = setTimeout(function () {
                isCalled = false;

              }, time);
            } else {
              clearInterval(interval);

              interval = setTimeout(function () {
                isCalled = false;
                fn.apply(this, args);
              }, time);
            }


          };
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {

          var globalSearch = SharedStateService.getSharedState('globalSearch');
          $rootScope.isRightPanelHidden = toState.name !== 'tickets.details';


          var toTickets = toState.name === 'tickets' || toState.name === 'tickets.details';
          var toDrafts = toState.name === 'drafts' || toState.name === 'drafts.details';
          var fromTickets = fromState.name === 'tickets' || fromState.name === 'tickets.details';
          var fromDrafts = fromState.name === 'drafts' || fromState.name === 'drafts.details';

          if (!toTickets && !fromDrafts || !toDrafts && !fromTickets) {
            globalSearch.count = undefined;
            globalSearch.selectedItemsCount = undefined;
          }

          //change filter
          globalSearch.openedItemName = undefined;
          // clear search field
          // if(toState.name === 'tickets.details' && globalSearch.searchValue === undefined) {
          //   globalSearch.searchValue = '';
          // }
          globalSearch.searchValue = '';

          if (toState.name === 'tickets' || (toState.name === 'tickets.details' && globalSearch.selectedItemsCount)) {
            globalSearch.goBack.func = $rootScope.$broadcast.bind($rootScope, 'uncheckAllTickets');
            globalSearch.goBack.tooltip = 'reset selected items';
          } else if (toState.name === 'tickets.details') {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = function () {
              $state.go('tickets');
              globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            };
            globalSearch.goBack.tooltip = 'collapse ticket';
          } else if (toState.name === 'drafts' || (toState.name === 'drafts.details' && globalSearch.selectedItemsCount)) {
            globalSearch.goBack.func = $rootScope.$broadcast.bind($rootScope, 'uncheckAllDrafts');
            globalSearch.goBack.tooltip = 'reset selected items';
          } else if (toState.name === 'drafts.details') {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = function () {
              $state.go('drafts');
              globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            };
            globalSearch.goBack.tooltip = 'collapse inbox';
          } else if (toState.name === 'companyProfile') {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = $state.go.bind($state, 'companies');
            globalSearch.goBack.tooltip = 'back to companies';
          } else if (toState.name.indexOf('settings.') === 0) {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = $state.go.bind($state, 'settings');
            globalSearch.goBack.tooltip = 'back to all settings';
          } else {
            globalSearch.goBack.isEnabled = false;
          }
        });

        $rootScope.getUserAvatarUrl = function (user) {
          if (!(user && user.avatar)) {
            return '/users/default/image' + '.jpg';
          }

          if (user.id) {
            return '/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
              '');
          } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
            return '/file/' + (user.avatar.origin.id) + '.jpg';
          } else {
            return '/users/default/image' + '.jpg';
          }
        };

        $rootScope.getContactAvatarUrl = function (contact) {
          if (!(contact && contact.avatar)) {
            return '/contacts/default/image' + '.jpg';
          }
          return '/contacts/' + (contact.id || 'default') + '/image' + (contact.avatar ?
            '.jpg?t=' + contact.avatar.updatedAt : '');
        };

        $rootScope.getCompanyCoverUrl = function (company) {
          if (!(company && company.cover)) {
            return '/company/default/cover' + '.jpg';
          }
          return '/company/' + (company.id || 'default') + '/cover.jpg?t=' + (company.cover ? company.cover.updatedAt :
            '');
        };

        $rootScope.getCompanyLogoUrl = function (company) {
          if (company && company.logo && company.logo && company.logo.base64 && !company.logo.cropped) {
            return company.logo.base64;
          } else if (!(company && company.logo && company.logo.cropped && company.logo.cropped.id)) {
            return '/company/default/logo' + '.jpg';
          }
          return '/file/' + company.logo.cropped.id + '.jpg?t=' + (company.logo.updatedAt ? company.logo.updatedAt :
            '');
        };

        $rootScope.getPhoneNumberCssClass = function (phoneNumber) {

          if (!phoneNumber) {
            return;
          } else if (phoneNumber.typeNumber === 'OFFICE') {
            return 'icn-user-phone';
          } else if (phoneNumber.typeNumber === 'MOBILE') {
            return 'icn-iphone';
          } else if (phoneNumber.typeNumber === 'FAX') {
            return 'icn-user-fax';
          }
        };

        $rootScope.getUserName = function (user, includeImail) {
          if (user && user.firstName) {
            var username = user.firstName + (user.lastName ? ' ' + user.lastName : '');

            if (includeImail && user.primaryEmail && user.primaryEmail) {
              username += (' "' + user.primaryEmail + '"');
            }

            return username;
          }
        };

        $rootScope.getContactName = function (contact, includeImail) {
          if (contact) {
            var contactname = contact.firstName + (contact.lastName ? ' ' + contact.lastName : '');

            if (includeImail) {
              contactname += (' "' + contact.email + '"');
            }

            return contactname;
          }
        };

        $rootScope.cancelEditForm = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $rootScope.logOut = function (message) {

          if (!message) {
            message = 'Your session has been closed.';
          }

          $rootScope.isLogOut = true;
          var confirmButton = 'OK';

          UserConfirmationsService.show(message, confirmButton, true).then(function () {
            window.loggingOut = true;
            window.location.href = '/logout';
            window.location.hash = '';
          });

        };

        $rootScope.showLockModal = function (isNeedReload) {
          $rootScope.isUnlockShowed = true;
          var modalParams = {
            animation: true,
            backdrop: 'static',
            keyboard: false,
            size: 'unlock-window',
            windowClass: 'lock-screen-modal',
            templateUrl: '/ng1/scripts/common/templates/unlock-modal.tpl.html'
          };

          modalParams.controller = (['$scope', '$uibModalInstance',
            function ($scope, $uibModalInstance) {
              $scope.unlockModel = {};

              $scope.unlock = function (code, model) {
                if (model.$valid) {
                  $scope.unlockModel.unlocking = true;
                  $http.post('/unlockScreen', { code: hex_md5(code) }).then(function (resp) {
                    $uibModalInstance.close();
                    $scope.unlockModel.unlocking = false;
                  }, function (resp) {
                    if (resp.status === 409) {
                      model.$setValidity('wrongCode', false);
                    }
                    $scope.unlockModel.unlocking = false;
                  });
                } else {
                  $scope.triedToUnlock = true;
                }
              };

              $scope.sendCode = function () {
                $scope.codeSending = true;
                $http.get('/sendUnlockScreenCode').then(function () {
                  $scope.codeSending = false;
                  $scope.unlockModel.codeSent = true;
                });
              };

              $scope.onCodeChange = function (model) {
                model.$setValidity('wrongCode', true);
              };

              $scope.isShowingErrors = function (form, fieldName) {
                return form && form[fieldName] && ($scope.triedToUnlock || form[fieldName].$dirty) && form[fieldName].$invalid;
              };

            }]);

          var modalInstance = $uibModal.open(modalParams);
          modalInstance.opened.then(function () {
            $('body').addClass('non-body-scroll');
          });

          modalInstance.result.finally(function () {
            $('body').removeClass('non-body-scroll');
          });

          modalInstance.result.then(function () {
            if (isNeedReload) {
              window.location.reload();
            }
            $rootScope.isUnlockShowed = false;
          });
        };

        $rootScope.safeDigest = function () {
          if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {

            $rootScope.$digest();
          }
        };

        $rootScope.isNumberKey = function (evt) {
          var charCode = (evt.which) ? evt.which : event.keyCode;
          if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;

          return true;
        };

        $rootScope.decimalNumberPattern = /^\d{1,10}(\.\d{0,2}){0,1}$/;
        $rootScope.decimalNumberPatternLow = /^\d{1,6}(\.\d{0,2}){0,1}$/;
        $rootScope.numberPattern = /^\d?[0-9]{0,17}$/;
        $rootScope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $rootScope.urlPattern = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        $rootScope.ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        $rootScope.PERCENT = /^[1-9][0-9]?$|^100$/;
        $rootScope.domainPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $rootScope.timeHoursAndMinutesPattern = /^(?:0?\d|1[12]):[0-5]?[0-9]$/;
        //display limit for infinity-scroll-pagination
        $rootScope.displayLimit = 20;

        $rootScope.discountTypes = {
          FIXED: '$',
          PERCENT: '%'
        };

        $templateRequest('commonHtml/assets/templates/user-confirmations.tpl.html');

      }]);

  function getUserDefaultPage() {



    var defaultTicketsPage,
      startPageMap = {
        ALL: 'all',
        UNASSIGNED: 'unassigned',
        MY_TICKETS: 'user',
        SHARED: 'shared',
        OPEN: 'open',
        CLOSED: 'closed',
        TRASH: 'trash',
        SPAM: 'spam',
        ON_HOLD: 'on_hold',
        COMPLETED: 'completed',
        IN_PROGRESS: 'in_progress'

      };

    if (!!window.loggingOut || location.href === '/logout') {
      return '';
    }

    if (window.startPage) {
      defaultTicketsPage = startPageMap[window.startPage];
    }

    if (defaultTicketsPage) {

      return '/tickets/' + defaultTicketsPage;
    }


    return '/ng2/tickets';
  }

}());
