'use strict';

(function () {

  var app = angular.module("quicktech",
    [
      'main.services',
      'quicktech.core.dashboards',
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
      'ngAnimate',
      'LocalStorageModule'
    ]);

  app.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', '$animateProvider',
    function ($stateProvider, $urlRouterProvider, localStorageServiceProvider, $animateProvider) {

      //uncomment this line for increasing angularjs performance (when debugging will not need)
      //$compileProvider.debugInfoEnabled(false);

      $animateProvider.classNameFilter(/angular-animate/);

      localStorageServiceProvider
        .setPrefix('quicktech')
        .setNotify(false, false);

      $urlRouterProvider.otherwise(getUserDefaultPage);

      $urlRouterProvider.when('/accounting', '/accounting/billable');

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
        .state('tickets-dashboard', waitForServices({
          url: '/tickets-dashboard',
          templateUrl: '/html/scripts/core/dashboards/tickets-dashboard/tickets-dashboard.tpl.html',
          controller: 'quicktech.core.dashboards.ticketsDashboardCtrl'
        }))
        .state('users', waitForServices({
          url: '/clients/users',
          templateUrl: '/html/scripts/core/users/users.tpl.html',
          controller: 'quicktech.core.users.usersCtrl'
        }))
        .state('companies', waitForServices({
          url: '/clients/companies',
          templateUrl: '/html/scripts/core/companies/companies.tpl.html',
          controller: 'quicktech.core.companies.companiesCtrl'
        }))
        .state('companyProfile', waitForServices({
          url: '/clients/companyProfile/:companyId?tabName',
          params: {
            tabName: 'devices'
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
          url: '/inventory/services/:tabName',
          templateUrl: '/html/scripts/core/services/services.tpl.html',
          controller: 'quicktech.core.services.servicesCtrl'
        }))
        .state('accounting', waitForServices({
          url: '/accounting',
          template: '<div ui-view></div>',
          redirectTo: 'accounting.dashboard'
        }))
        .state('accounting.dashboard', waitForServices({
          url: '/dashboard',
          templateUrl: '/html/scripts/core/dashboards/billing-dashboard/billing-dashboard.tpl.html',
          controller: 'quicktech.core.dashboards.billingDashboardCtrl'
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
        .state('settings', waitForServices({
          url: '/settings',
          templateUrl: '/html/scripts/core/settings/settings.tpl.html',
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
        .state('settings.emailNotifications', waitForServices({
          url: '/emailNotifications',
          templateUrl: '/html/scripts/core/settings/email-notifications/email-notifications.tpl.html',
          controller: 'quicktech.core.settings.emailNotificationsCtrl'
        }))
        .state('settings.tags', waitForServices({
          url: '/tags',
          templateUrl: '/html/scripts/core/settings/tags/tags.tpl.html',
          controller: 'quicktech.core.settings.tagsCtrl'
        }))
        .state('settings.activityHistory', waitForServices({
          url: '/activityHistory',
          templateUrl: '/html/scripts/core/settings/activity-history/activity-history.tpl.html',
          controller: 'quicktech.core.settings.activityHistoryCtrl'
        }))
        .state('settings.companyProfile', waitForServices({
          url: '/companyProfile',
          params: {
            isAddressFocused: false
          },
          templateUrl: '/html/scripts/core/settings/company-profile/company-profile.tpl.html',
          controller: 'quicktech.core.settings.companyProfileCtrl'
        }))
        .state('settings.techUsers', waitForServices({
          url: '/techUsers',
          templateUrl: '/html/scripts/core/settings/tech-users/tech-users.tpl.html',
          controller: 'quicktech.core.settings.techUsersCtrl'
        }))
        .state('settings.email', waitForServices({
          url: '/email',
          templateUrl: '/html/scripts/core/settings/email/email.tpl.html',
          controller: 'quicktech.core.settings.emailCtrl'
        }))
        .state('settings.services', waitForServices({
          url: '/services',
          templateUrl: '/html/scripts/core/settings/services/services.tpl.html',
          controller: 'quicktech.core.settings.servicesCtrl'
        }))
        .state('settings.taxRates', waitForServices({
          url: '/taxRates',
          templateUrl: '/html/scripts/core/settings/tax-rates/tax-rates.tpl.html',
          controller: 'quicktech.core.settings.taxRatesCtrl'
        }))
        .state('settings.tickets', waitForServices({
          url: '/tickets',
          templateUrl: '/html/scripts/core/settings/tickets/tickets.tpl.html',
          controller: 'quicktech.core.settings.ticketsCtrl'
        }))
        .state('settings.permissionsManagement', waitForServices({
          url: '/permissionsManagement',
          templateUrl: '/html/scripts/core/settings/permissions-management/permissions-management.tpl.html',
          controller: 'quicktech.core.settings.permissionsManagementCtrl'
        }))
        .state('settings.emailTemplates', waitForServices({
          url: '/emailTemplates',
          templateUrl: '/html/scripts/core/settings/email-templates/email-templates.tpl.html',
          controller: 'quicktech.core.settings.emailTemplatesCtrl'
        }))
        .state('quickSupport', waitForServices({
          url: '/quickSupport',
          templateUrl: '/html/scripts/core/quick-support/quick-support.tpl.html',
          controller: 'quicktech.core.quickSupport.quickSupportCtrl'
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
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.SharedStateService',
      function ($rootScope, $templateRequest, CompaniesService, $state, $uibModal, TicketsService, $stateParams,
                UserConfirmationsService, SharedStateService) {

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {

          var globalSearch = SharedStateService.getSharedState('globalSearch');
          $rootScope.isRightPanelHidden = toState.name !== 'tickets.details';

          if (toState.name !== 'tickets' && toState.name !== 'tickets.details') {
            globalSearch.count = undefined;
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
            $uibModal.open({
              templateUrl: '/html/scripts/common/templates/remote-connection-complete.tpl.html',
              controller: ['$scope', '$uibModalInstance', 'TicketsService', function ($scope, $uibModalInstance, TicketsService) {
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
                  $uibModalInstance.close();
                };

                $scope.createTicketUpdate = function () {
                  $uibModalInstance.close($scope.selectedTicket.item);
                };

                $scope.cancelConfirm = function (isGoBack) {
                  if (isGoBack) {
                    $scope.selectingTicket = false;
                  } else {
                    $uibModalInstance.dismiss(false);
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

                //create ticket update
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

                //create ticket
                var modalInstance = $uibModal.open({
                  templateUrl: '/html/scripts/core/header/create-new-entity/create-new-entity.tpl.html',
                  controller: 'createNewEntityCtrl',
                  windowClass: 'create-popup',
                  backdrop: 'static',
                  animation: true,
                  resolve: {
                    sessionId: function () {
                      return sessionId;
                    },
                    sessionTime: function () {
                      return sessionTime;
                    },
                    resolvedDeviceId: function () {
                      return deviceId;
                    },
                    resolvedCompanyId: function () {
                      return companyId;
                    },
                    resolvedOpenedTab: function () {
                      return 'ticket';
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
        $rootScope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

        $templateRequest('/commonHtml/assets/templates/user-confirmations.tpl.html');

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
