'use strict';

(function () {

  var app = angular.module("quicktech",
    [
      'main.services',
      'quicktech.core.tickets',
      'quicktech.core.users',
      'quicktech.common.services',
      'quicktech.common.directives',
      'quicktech.core.companies',
      'quicktech.core.products',
      'quicktech.core.services',
      'quicktech.core.billable',
      'quicktech.core.recurring',
      'quicktech.core.receivable',
      'quicktech.core.receiptArchive',
      'quicktech.core.vendors',
      'quicktech.core.leftPanel',
      'quicktech.core.rightPanel',
      'quicktech.core.settings',
      'quicktech.core.devices',
      'quicktech.core.quickSupport',
      'quicktech.core.taxRates',
      'ui.router',
      'ui.select',
      'ui.bootstrap',
      'ngSanitize',
      'ngMessages',
      'ngAnimate'
    ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $compileProvider) {

    //uncomment this line for increasing angularjs performance (when debugging will not need)
    //$compileProvider.debugInfoEnabled(false);

    $urlRouterProvider.otherwise(getUserDefaultPage);

    $urlRouterProvider.when('/accounting', '/accounting/billable');
    $urlRouterProvider.when('/settings', '/settings/myProfile');

    $stateProvider
      .state('tickets', waitForServices({
        url: '/tickets/:listType',
        templateUrl: '/html/scripts/core/tickets/tickets.tpl.html',
        controller: 'quicktech.core.tickets.ticketsCtrl'
      }))
      .state('tickets.details', waitForServices({
        url: '/:ticketId',
        params: {
          ticketId: '',
          remoteParams: null
        },
        templateUrl: '/html/scripts/core/tickets/ticket-details.tpl.html',
        controller: 'quicktech.core.tickets.ticketDetailsCtrl'
      }))
      .state('users', waitForServices({
        url: '/clients/users',
        templateUrl: '/html/scripts/core/users/users.tpl.html',
        controller: 'quicktech.core.users.usersCtrl'
      }))
      .state('users.create', waitForServices({
        url: '/create',
        templateUrl: '/html/scripts/core/users/user-edit.tpl.html',
        controller: 'quicktech.core.users.createUserCtrl'
      }))
      .state('companies', waitForServices({
        url: '/clients/companies',
        templateUrl: '/html/scripts/core/companies/companies.tpl.html',
        controller: 'quicktech.core.companies.companiesCtrl'
      }))
      .state('createCompany', waitForServices({
        url: '/clients/companies/create',
        templateUrl: '/html/scripts/core/companies/edit-company.tpl.html',
        controller: 'quicktech.core.companies.editCompanyCtrl'
      }))
      .state('editCompany', waitForServices({
        url: '/clients/companies/edit/:companyId',
        templateUrl: '/html/scripts/core/companies/edit-company.tpl.html',
        controller: 'quicktech.core.companies.editCompanyCtrl'
      }))
      .state('companyProfile', waitForServices({
        url: '/clients/companyProfile/:companyId?tabName',
        params: {
          tabName: ''
        },
        reloadOnSearch: false,
        templateUrl: '/html/scripts/core/companies/company-profile/company-profile.tpl.html',
        controller: 'quicktech.core.companies.companyProfileCtrl'
      }))
      .state('products', waitForServices({
        url: '/inventory/products/:tabName',
        templateUrl: '/html/scripts/core/products/products.tpl.html',
        controller: 'quicktech.core.products.productsCtrl'
      }))
      .state('services', waitForServices({
        url: '/inventory/services',
        templateUrl: '/html/scripts/core/services/services.tpl.html',
        controller: 'quicktech.core.services.servicesCtrl'
      }))
      .state('accounting', waitForServices({
        url: '/accounting',
        template: '<div ui-view></div>',
        redirectTo: 'accounting.billable'
      }))
      .state('accounting.billable', waitForServices({
        url: '/billable',
        templateUrl: '/html/scripts/core/billable/billable.tpl.html',
        controller: 'quicktech.core.billable.billableCtrl'
      }))
      .state('accounting.recurring', waitForServices({
        url: '/recurring',
        templateUrl: '/html/scripts/core/recurring/recurring.tpl.html',
        controller: 'quicktech.core.recurring.recurringCtrl'
      }))
      .state('receivable', waitForServices({
        url: '/accounting/receivable/:mode',
        templateUrl: '/html/scripts/core/receivable/receivable.tpl.html',
        controller: 'quicktech.core.receivable.receivableCtrl'
      }))
      .state('receipt-archive', waitForServices({
        url: '/accounting/receipt-archive/:mode',
        templateUrl: '/html/scripts/core/receipt-archive/receipt-archive.tpl.html',
        controller: 'quicktech.core.receiptArchive.receiptArchiveCtrl'
      }))
      .state('vendors', waitForServices({
        url: '/inventory/vendors',
        templateUrl: '/html/scripts/core/vendors/vendors.tpl.html',
        controller: 'quicktech.core.vendors.vendorsCtrl'
      }))
      .state('createVendor', waitForServices({
        url: '/inventory/vendors/create',
        templateUrl: '/html/scripts/core/vendors/edit-vendor.tpl.html',
        controller: 'quicktech.core.vendors.editVendorCtrl'
      }))
      .state('editVendor', waitForServices({
        url: '/inventory/vendors/edit/:vendorId',
        templateUrl: '/html/scripts/core/vendors/edit-vendor.tpl.html',
        controller: 'quicktech.core.vendors.editVendorCtrl'
      }))
      .state('settings', waitForServices({
        url: '/settings',
        templateUrl: '/html/scripts/core/settings/settings.tpl.html',
        redirectTo: 'settings.myProfile',
        controller: ['$scope', '$state', 'quicktech.common.services.PermissionsService',
          function ($scope, $state, PermissionsService) {
            $scope.PermissionsService = PermissionsService;
            $scope.$watch(function () {
              return $state.current.url;
            }, function (url) {
              $scope.settingMode = url;
            });
          }
        ]
      }))
      .state('settings.myProfile', waitForServices({
        url: '/myProfile',
        templateUrl: '/html/scripts/core/settings/my-profile/my-profile.tpl.html',
        controller: 'quicktech.core.settings.myProfileCtrl'
      }))
      .state('settings.techUsers', waitForServices({
        url: '/techUsers',
        templateUrl: '/html/scripts/core/settings/tech-users/tech-users.tpl.html',
        controller: 'quicktech.core.settings.techUsersCtrl'
      }))
      .state('settings.companyInfo', waitForServices({
        url: '/companyInfo',
        templateUrl: '/html/scripts/core/settings/company-info/company-info.tpl.html',
        controller: 'quicktech.core.settings.companyInfoCtrl'
      }))
      .state('settings.permissionsManagement', waitForServices({
        url: '/permissionsManagement',
        templateUrl: '/html/scripts/core/settings/permissions-management/permissions-management.tpl.html',
        controller: 'quicktech.core.settings.permissionsManagement'
      }))
      .state('settings.emailTemplates', waitForServices({
        url: '/emailTemplates',
        templateUrl: '/html/scripts/core/settings/email-templates/email-templates.tpl.html',
        controller: 'quicktech.core.settings.emailTemplatesCtrl'
      }))
      //.state('devices', waitForServices({
      //  url: '/clients/devices',
      //  templateUrl: '/html/scripts/core/devices/devices.tpl.html',
      //  controller: 'quicktech.core.devices.devicesCtrl'
      //}))
      //.state('companyDevices', waitForServices({
      //  url: '/clients/companyDevices/:companyId',
      //  templateUrl: '/html/scripts/core/devices/company-devices.tpl.html',
      //  controller: 'quicktech.core.devices.companyDevicesCtrl'
      //}))
      .state('quickSupport', waitForServices({
        url: '/quickSupport',
        templateUrl: '/html/scripts/core/quick-support/quick-support.tpl.html',
        controller: 'quicktech.core.quickSupport.quickSupportCtrl'
      }))
      .state('taxRates', waitForServices({
        url: '/inventory/taxRates',
        templateUrl: '/html/scripts/core/tax-rates/tax-rates.tpl.html',
        controller: 'quicktech.core.taxRates.taxRatesCtrl'
      }));

    function waitForServices(conf) {
      if (!conf.resolve) {
        conf.resolve = {};
      }

      conf.resolve.waitForServicesInitialization = ['$q', 'UsersService', function ($q, UsersService) {

        var def = $q.defer();
        UsersService._addInitListener(function () {
          def.resolve();
        });

        return def.promise;
      }];

      return conf;
    }

  }]);

  app.run(
    ['$rootScope', '$templateCache', 'CompaniesService', '$state', '$modal', 'TicketsService', '$stateParams',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.SharedStateService',
      function ($rootScope, $templateCache, CompaniesService, $state, $modal, TicketsService, $stateParams,
                UserConfirmationsService, SharedStateService) {

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {

          var globalSearch = SharedStateService.getSharedState('globalSearch');
          $rootScope.isRightPanelHidden = toState.name !== 'tickets.details';

          if (toState.name !== 'tickets' && toState.name !== 'tickets.details') {
            if (fromState.name === 'users.create' && toState.name === 'users' || fromState.name === 'users' && toState.name === 'users.create') {
              return;
            }
            globalSearch.count = 0;
            globalSearch.selectedItemsCount = undefined;
          }
          globalSearch.openedItemName = undefined;
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
          } else if (toState.name === 'editCompany') {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = $state.go.bind($state, 'companyProfile', { companyId: $stateParams.companyId });
            globalSearch.goBack.tooltip = 'back to company profile';
          } else if (toState.name === 'companyProfile' || toState.name === 'createCompany') {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = $state.go.bind($state, 'companies');
            globalSearch.goBack.tooltip = 'back to companies';
          } else if (toState.name === 'createVendor' || toState.name === 'editVendor') {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = $state.go.bind($state, 'vendors');
            globalSearch.goBack.tooltip = 'back to vendors';
          } else {
            globalSearch.goBack.isEnabled = false;
          }
        });

        CompaniesService._addInitListener(function () {
          var currentCompany = CompaniesService.getCurrentCompany();
          if (currentCompany.status === 'SIGN_UP') {
            $state.go('settings.companyInfo');
          }
        });

        $rootScope.getUserAvatarUrl = function (user) {
          if (!(user && user.avatar)) {
            return '/users/default/image'
          }
          return '/users/' + (user.id || 'default') + '/image' + (user.avatar ? '?t=' + user.avatar.updatedAt : '');
        };

        $rootScope.getContactAvatarUrl = function (contact) {
          if (!(contact && contact.avatar)) {
            return '/contacts/default/image'
          }
          return '/contacts/' + (contact.id || 'default') + '/image' + (contact.avatar ? '?t=' + contact.avatar.updatedAt : '');
        };

        $rootScope.getCompanyCoverUrl = function (company) {
          if (!(company && company.cover)) {
            return '/company/default/cover'
          }
          return '/company/' + (company.id || 'default') + '/cover?t=' + (company.cover ? company.cover.updatedAt : '');
        };

        $rootScope.getCompanyLogoUrl = function (company) {
          if (!(company && company.logo && company.logo.cropped && company.logo.cropped.id)) {
            return '/company/default/logo'
          }
          return '/file/' + company.logo.cropped.id + '?t=' + (company.logo.updatedAt ? company.logo.updatedAt : '');
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
          if (user) {
            var username = user.firstName + (user.lastName ? ' ' + user.lastName : '');

            if (includeImail && user.primaryEmail && user.primaryEmail) {
              username += (' "' + user.primaryEmail + '"')
            }

            return username;
          }
        };

        $rootScope.getContactName = function (contact, includeImail) {
          if (contact) {
            var contactname = contact.firstName + (contact.lastName ? ' ' + contact.lastName : '');

            if (includeImail) {
              contactname += (' "' + contact.email + '"')
            }

            return contactname;
          }
        };

        $rootScope.cancelEditForm = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $rootScope.openCreateTicketForm = function (sessionId, sessionTime, companyId, deviceId) {
          if (!sessionId) {
            throw 'SessionId is required'
          }

          if (sessionId === $rootScope.currentRemoteSessionId) {
            $modal.open({
              templateUrl: '/html/scripts/common/templates/remote-connection-complete.tpl.html',
              controller: ['$scope', '$modalInstance', 'TicketsService', function ($scope, $modalInstance, TicketsService) {
                $scope.selectTicket = false;
                $scope.selectedTicket = {};
                $scope.searchTickets = TicketsService.search.bind(this, function (resp) {
                  $scope.filteredTickets = resp;
                });

                $scope.getTicketLabel = function (ticket) {
                  if (ticket && ticket.number && ticket.subject) {
                    return ticket.number + ' - ' + ticket.subject;
                  } else {
                    return '';
                  }
                };

                $scope.selectTicket = function (isTUCreating) {
                  $scope.selectingTicket = isTUCreating;
                };

                $scope.onTicketSelect = function (value) {
                  var ticketNumber = value.split(' - ')[0];

                  $scope.selectedTicket.item = $scope.filteredTickets.find(function (ticket) {
                    return ticket.number === ticketNumber;
                  })
                };

                $scope.createTicket = function () {
                  $modalInstance.close();
                };

                $scope.createTicketUpdate = function () {
                  $modalInstance.close($scope.selectedTicket.item);
                };

                $scope.cancelConfirm = function (isGoBack) {
                  if (isGoBack) {
                    $scope.selectingTicket = false;
                  } else {
                    $modalInstance.dismiss(false);
                  }
                };

              }],
              keyboard: false,
              size: 'custom-size-confirmation-pop-up',
              windowClass: 'modal-spam',
              backdrop: 'static',
              animation: true

            }).result.then(function (ticket) {
              if (ticket) {
                var params = {
                  listType: 'all',
                  ticketId: ticket.id,
                  remoteParams: {
                    connectionDuration: sessionTime,
                    companyId: companyId,
                    deviceId: deviceId
                  }
                };

                if (!ticket.assignedUser || !ticket.assignedUser.id) {
                  TicketsService.assignTo(ticket.id, $rootScope.currentUser.id, function () {
                    $state.go('tickets.details', params);
                  })
                } else {
                  $state.go('tickets.details', params);
                }
              } else if (ticket === undefined) {

                var modalInstance = $modal.open({
                  templateUrl: '/html/scripts/core/tickets/create/create-ticket.tpl.html',
                  controller: 'quicktech.core.tickets.createTicketCtrl',
                  windowClass: 'modal-create-ticket',
                  backdrop: 'static',
                  animation: true,
                  resolve: {
                    sessionId: function () {
                      return sessionId;
                    },
                    sessionTime: function () {
                      return sessionTime;
                    },
                    fromRemoteCompanyId: function () {
                      return companyId;
                    },
                    fromRemoteDeviceId: function () {
                      return deviceId;
                    }
                  }
                });

                modalInstance.opened.then(function () {
                  $('body').addClass('non-body-scroll');
                });

                modalInstance.result.finally(function () {
                  $('body').removeClass('non-body-scroll');
                });
              }
            });

            $rootScope.currentRemoteSessionId = '';
          }

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

        $rootScope.decimalNumberPattern = /^\d{1,10}(\.\d{0,2}){0,1}$/;
        $rootScope.numberPattern = /^\d?[0-9]{0,17}$/;

        $templateCache.put("template/typeahead/typeahead-popup.html",
          "<ul class=\"dropdown-menu\" qt-typeahead-styler ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
          "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
          "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
          "    </li>\n" +
          "</ul>\n" +
          "");

        $templateCache.put("template/datepicker/day.html",
          "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
          "  <thead>\n" +
          "    <tr>\n" +
          "      <th colspan=\"{{5 + showWeeks}}\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
          "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
          "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
          "    </tr>\n" +
          "    <tr>\n" +
          "      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
          "      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{ label.abbr.substring(0, 2).toUpperCase() }}</small></th>\n" +
          "    </tr>\n" +
          "  </thead>\n" +
          "  <tbody>\n" +
          "    <tr ng-repeat=\"row in rows track by $index\">\n" +
          "      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
          "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\" ng-class=\"dt.customClass\">\n" +
          "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary, 'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
          "      </td>\n" +
          "    </tr>\n" +
          "  </tbody>\n" +
          "</table>\n" +
          "");

      }]);

  function getUserDefaultPage() {

    var defaultTicketsPage,
      startPageMap = {
        UNASSIGNED: 'unassigned',
        MY_TICKETS: 'user',
        SHARED: 'shared',
        OPEN: 'open',
        CLOSED: 'closed',
        TRASH: 'trash',
        SPAM: 'spam'
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

    return '/tickets/unassigned';
  }

}());
