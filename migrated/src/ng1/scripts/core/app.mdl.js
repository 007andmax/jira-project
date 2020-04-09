'use strict';

(function () {

  var app = angular.module('quicktech',
    [
      'main.services',
      'quicktech.core.dashboards',
      'quicktech.core.tickets',
      'quicktech.common.services',
      'quicktech.common.directives',
      'quicktech.core.companies',
      'quicktech.core.products',
      'quicktech.core.services',
      'quicktech.core.billable',
      'quicktech.core.receivable',
      'quicktech.core.receiptArchive',
      'quicktech.core.leftPanel',
      'quicktech.core.rightPanel',
      'quicktech.core.settings',
      'quicktech.core.devices',
      'quicktech.core.quickSupport',
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
        .state('tickets', waitForServices({
          url: '/tickets/:listType',
          templateUrl: '/ng1/scripts/core/tickets/tickets.tpl.html',
          controller: 'quicktech.core.tickets.ticketsCtrl'
        }))
        .state('tickets.details', waitForServices({
          url: '/:ticketId',
          params: {
            ticketId: '',
            remoteParams: null
          },
          templateUrl: '/ng1/scripts/core/tickets/ticket-details.tpl.html',
          controller: 'quicktech.core.tickets.ticketDetailsCtrl'
        }))
        .state('drafts', waitForServices({
          url: '/drafts',
          templateUrl: '/ng1/scripts/core/tickets/drafts/drafts.tpl.html',
          controller: 'quicktech.core.tickets.draftsCtrl'
        }))
        .state('drafts.details', waitForServices({
          url: '/:draftId',
          templateUrl: '/ng1/scripts/core/tickets/drafts/draft-details.tpl.html',
          controller: 'quicktech.core.tickets.draftDetailsCtrl'
        }))
        .state('tickets-dashboard', waitForServices({
          url: '/tickets-dashboard',
          templateUrl: '/ng1/scripts/core/dashboards/tickets-dashboard/tickets-dashboard.tpl.html',
          controller: 'quicktech.core.dashboards.ticketsDashboardCtrl'
        }))
        .state('companyProfile', waitForServices({
          url: '/clients/companyProfile/:companyId?tabName',
          params: {
            tabName: 'dashboard'
          },
          reloadOnSearch: false,
          templateUrl: '/ng1/scripts/core/companies/company-profile/company-profile.tpl.html',
          controller: 'quicktech.core.companies.companyProfileCtrl'
        }))
        .state('password-manager', waitForServices({
          url: '/ng2/password-manager',
          template: '<password-manager></password-manager>'
        }))
        .state('company-password-manager', waitForServices({
          url: '/ng2/company-password-manager',
          template: '<company-password-manager></company-password-manager>'
        }))
        .state('company-user', waitForServices({
          url: '/ng2/company-user',
          template: '<company-user></company-user>'
        }))
        .state('inventory', waitForServices({
          url: '/ng2/inventory/products',
          template: '<inventory-component></inventory-component>'
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
        .state('company-products', waitForServices({
          url: '/ng2/company-products',
          template: '<company-products></company-products>'
        }))
        .state('new-users', waitForServices({
          url: '/ng2/users',
          template: '<users-component></users-component>'
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
        .state('accounting', waitForServices({
          url: '/accounting',
          template: '<div ui-view></div>',
          redirectTo: 'accounting.dashboard'
        }))
        .state('accounting.dashboard', waitForServices({
          url: '/dashboard',
          templateUrl: '/ng1/scripts/core/dashboards/billing-dashboard/billing-dashboard.tpl.html',
          controller: 'quicktech.core.dashboards.billingDashboardCtrl'
        }))
        .state('accounting.billable', waitForServices({
          url: '/billable',
          templateUrl: '/ng1/scripts/core/billable/billable.tpl.html',
          controller: 'quicktech.core.billable.billableCtrl'
        }))
        .state('services', waitForServices({
          url: '/accounting/services',
          templateUrl: '/ng1/scripts/core/services/services.tpl.html',
          controller: 'quicktech.core.services.servicesCtrl'
        }))
        .state('receivable', waitForServices({
          url: '/accounting/receivable/:mode',
          templateUrl: '/ng1/scripts/core/receivable/receivable.tpl.html',
          controller: 'quicktech.core.receivable.receivableCtrl'
        }))
        .state('payments', waitForServices({
          url: '/accounting/payments/:mode',
          templateUrl: '/ng1/scripts/core/billable/payments/payments.tpl.html',
          controller: 'quicktech.core.payments.paymentsCtrl'
        }))
        .state('receipt-archive', waitForServices({
          url: '/accounting/receipt-archive/:mode',
          templateUrl: '/ng1/scripts/core/receipt-archive/receipt-archive.tpl.html',
          controller: 'quicktech.core.receiptArchive.receiptArchiveCtrl'
        }))
        .state('service-agreements', waitForServices({
          url: '/accounting/service-agreements',
          templateUrl: '/ng1/scripts/core/service-agreements/service-agreements.tpl.html',
          controller: 'quicktech.core.serviceAgreements.serviceAgreementsCtrl'
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
        .state('settings', waitForServices({
          url: '/settings',
          templateUrl: '/ng1/scripts/core/settings/settings.tpl.html',
          controller: ['$scope', '$state', 'quicktech.common.services.PermissionsService', 'UsersService',
            function ($scope, $state, PermissionsService, UsersService) {
              $scope.PermissionsService = PermissionsService;
              $scope.updateWelcomeWizard = UsersService.updateWelcomeWizard;
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
          templateUrl: '/ng1/scripts/core/settings/my-profile/my-profile.tpl.html',
          controller: 'quicktech.core.settings.myProfileCtrl'
        }))
        .state('settings.emailNotifications', waitForServices({
          url: '/emailNotifications',
          templateUrl: '/ng1/scripts/core/settings/email-notifications/email-notifications.tpl.html',
          controller: 'quicktech.core.settings.emailNotificationsCtrl'
        }))
        .state('settings.tags', waitForServices({
          url: '/tags',
          templateUrl: '/ng1/scripts/core/settings/tags/tags.tpl.html',
          controller: 'quicktech.core.settings.tagsCtrl'
        }))
        .state('settings.tags.companies', waitForServices({
          url: '/companies',
          templateUrl: '/ng1/scripts/core/settings/tags/tags.tpl.html',
          controller: 'quicktech.core.settings.tagsCtrl',
          params: {
            type: 'company'
          }
        }))
        .state('settings.tags.tickets', waitForServices({
          url: '/tickets',
          templateUrl: '/ng1/scripts/core/settings/tags/tags.tpl.html',
          controller: 'quicktech.core.settings.tagsCtrl',
          params: {
            type: 'ticket'
          }
        }))
        .state('settings.credit-card', waitForServices({
          url: '/credit-card',
          templateUrl: '/ng1/scripts/core/settings/credit-card/credit-card.tpl.html',
          controller: 'quicktech.core.settings.creditCardCtrl'
        }))
        .state('settings.activityHistory', waitForServices({
          url: '/activityHistory',
          templateUrl: '/ng1/scripts/core/settings/activity-history/activity-history.tpl.html',
          controller: 'quicktech.core.settings.activityHistoryCtrl'
        }))
        .state('settings.companyProfile', waitForServices({
          url: '/companyProfile',
          params: {
            isAddressFocused: false,
            fromWelcomeWizard: false
          },
          templateUrl: '/ng1/scripts/core/settings/company-profile/company-profile.tpl.html',
          controller: 'quicktech.core.settings.companyProfileCtrl'
        }))
        .state('settings.techUsers', waitForServices({
          url: '/techUsers',
          templateUrl: '/ng1/scripts/core/settings/tech-users/tech-users.tpl.html',
          controller: 'quicktech.core.settings.techUsersCtrl'
        }))
        .state('settings.commissions', waitForServices({
          url: '/commissions',
          templateUrl: '/ng1/scripts/core/settings/commissions/commissions.tpl.html',
          controller: 'quicktech.core.settings.commissionsCtrl'
        }))
        .state('settings.email', waitForServices({
          url: '/email',
          templateUrl: '/ng1/scripts/core/settings/email/email.tpl.html',
          controller: 'quicktech.core.settings.emailCtrl'
        }))
        .state('settings.taxes', waitForServices({
          url: '/taxes',
          templateUrl: '/ng1/scripts/core/settings/taxes/taxes.tpl.html',
          controller: 'quicktech.core.settings.taxesCtrl'
        }))
        .state('settings.tickets', waitForServices({
          url: '/tickets',
          templateUrl: '/ng1/scripts/core/settings/tickets/tickets.tpl.html',
          controller: 'quicktech.core.settings.ticketsCtrl'
        }))
        .state('settings.permissionsManagement', waitForServices({
          url: '/permissionsManagement',
          templateUrl: '/ng1/scripts/core/settings/permissions-management/permissions-management.tpl.html',
          controller: 'quicktech.core.settings.permissionsManagementCtrl'
        }))
        .state('settings.emailTemplates', waitForServices({
          url: '/emailTemplates',
          templateUrl: '/ng1/scripts/core/settings/email-templates/email-templates.tpl.html',
          controller: 'quicktech.core.settings.emailTemplatesCtrl'
        }))
        .state('quickSupport', waitForServices({
          url: '/quickSupport',
          templateUrl: '/ng1/scripts/core/quick-support/quick-support.tpl.html',
          controller: 'quicktech.core.quickSupport.quickSupportCtrl'
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
        })).state('hardware-summary', waitForServices({
          url: '/reports/hardware-summary',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/hardware-summary.tpl.html',
          controller: 'quicktech.core.reports.reportsCtrl'
        }))
        .state('software-summary', waitForServices({
          url: '/reports/software-summary',
          templateUrl: '/ng1/scripts/core/reports/reports-templates/software-summary.tpl.html',
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

        $rootScope.openCreateTicketForm = function (sessionId, sessionTime, companyId, deviceId) {
          if (!sessionId) {
            throw 'SessionId is required';
          }

          if (sessionId === $rootScope.currentRemoteSessionId) {
            $uibModal.open({
              templateUrl: '/ng1/scripts/common/templates/remote-connection-complete.tpl.html',
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
                  });
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
                  });
                } else {
                  $state.go('tickets.details', params);
                }
              } else if (ticket === undefined) {

                //create ticket
                var modalInstance = $uibModal.open({
                  templateUrl: '/ng1/scripts/core/header/create-new-entity/create-new-entity.tpl.html',
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
                    },
                    resolvedExistedItem: false
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


    return '/tickets/user';
  }

}());
