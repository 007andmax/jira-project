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
      'ui.router',
      'ui.select',
      'ui.bootstrap',
      'ngSanitize',
      'ngMessages',
      'ngAnimate'
    ]);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/tickets/unassigned');

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
        templateUrl: '/html/scripts/core/tickets/ticket-details.tpl.html',
        controller: 'quicktech.core.tickets.ticketDetailsCtrl'
      }))
      .state('users', waitForServices({
        url: '/users',
        templateUrl: '/html/scripts/core/users/users.tpl.html',
        controller: 'quicktech.core.users.usersCtrl'
      }))
      .state('users.create', waitForServices({
        url: '/create',
        templateUrl: '/html/scripts/core/users/user-edit.tpl.html',
        controller: 'quicktech.core.users.createUserCtrl'
      }))
      .state('companies', waitForServices({
        url: '/companies',
        templateUrl: '/html/scripts/core/companies/companies.tpl.html',
        controller: 'quicktech.core.companies.companiesCtrl'
      }))
      .state('createCompany', waitForServices({
        url: '/companies/create',
        templateUrl: '/html/scripts/core/companies/edit-company.tpl.html',
        controller: 'quicktech.core.companies.editCompanyCtrl'
      }))
      .state('editCompany', waitForServices({
        url: '/companies/edit/:companyId',
        templateUrl: '/html/scripts/core/companies/edit-company.tpl.html',
        controller: 'quicktech.core.companies.editCompanyCtrl'
      }))
      .state('companyProfile', waitForServices({
        url: '/companyProfile/:companyId',
        templateUrl: '/html/scripts/core/companies/company-profile.tpl.html',
        controller: 'quicktech.core.companies.companyProfileCtrl'
      }))
      .state('products', waitForServices({
        url: '/products',
        templateUrl: '/html/scripts/core/products/products.tpl.html',
        controller: 'quicktech.core.products.productsCtrl'
      }))
      .state('services', waitForServices({
        url: '/services',
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
        url: '/receivable/:mode',
        templateUrl: '/html/scripts/core/receivable/receivable.tpl.html',
        controller: 'quicktech.core.receivable.receivableCtrl'
      }))
      .state('receipt-archive', waitForServices({
        url: '/receipt-archive/:mode',
        templateUrl: '/html/scripts/core/receipt-archive/receipt-archive.tpl.html',
        controller: 'quicktech.core.receiptArchive.receiptArchiveCtrl'
      }))
      .state('vendors', waitForServices({
        url: '/vendors',
        templateUrl: '/html/scripts/core/vendors/vendors.tpl.html',
        controller: 'quicktech.core.vendors.vendorsCtrl'
      }))
      .state('createVendor', waitForServices({
        url: '/vendors/create',
        templateUrl: '/html/scripts/core/vendors/edit-vendor.tpl.html',
        controller: 'quicktech.core.vendors.editVendorCtrl'
      }))
      .state('editVendor', waitForServices({
        url: '/vendors/edit/:vendorId',
        templateUrl: '/html/scripts/core/vendors/edit-vendor.tpl.html',
        controller: 'quicktech.core.vendors.editVendorCtrl'
      }))
      .state('settings', waitForServices({
        url: '/settings',
        templateUrl: '/html/scripts/core/settings/settings.tpl.html',
        redirectTo: 'settings.myProfile',
        controller: ['$scope', '$state', function ($scope, $state) {

          $scope.$watch(function () {
            return $state.current.url;
          }, function (url) {
            $scope.settingMode = url;
          });
        }]
      }))
      .state('settings.myProfile', waitForServices({
        url: '/myProfile',
        templateUrl: '/html/scripts/core/settings/my-profile/my-profile.tpl.html',
        controller: 'quicktech.core.settings.myProfileCtrl'
      }))
      .state('settings.companyInfo', waitForServices({
        url: '/companyInfo',
        templateUrl: '/html/scripts/core/settings/company-info/company-info.tpl.html',
        controller: 'quicktech.core.settings.companyInfoCtrl'
      }))
      .state('settings.emailTemplates', waitForServices({
        url: '/emailTemplates',
        templateUrl: '/html/scripts/core/settings/email-templates/email-templates.tpl.html',
        controller: 'quicktech.core.settings.emailTemplatesCtrl'
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
    ['$rootScope', '$templateCache', function ($rootScope, $templateCache) {
      $rootScope.getUserAvatarUrl = function (user) {
        if (!user) {
          return '/users/default/image'
        }
        return '/users/' + (user.id || 'default') + '/image' + (user.avatar ? '?t=' + user.avatar.updatedAt : '');
      };

      $rootScope.getContactAvatarUrl = function (contact) {
        if (!contact) {
          return '/contacts/default/image'
        }
        return '/contacts/' + (contact.id || 'default') + '/image' + (contact.avatar ? '?t=' + contact.avatar.updatedAt : '');
      };

      $rootScope.getCompanyCoverUrl = function (company) {
        if (!company) {
          return '/company/default/cover'
        }
        return '/company/' + (company.id || 'default') + '/cover?t=' + (company.cover ? company.cover.updatedAt : '');
      };

      $rootScope.getCompanyLogoUrl = function (company) {
        if (!company) {
          return '/company/default/logo'
        }
        return '/companyLogo/' + (company.id || 'default') + '?t=' + (company.logo ? company.logo.updatedAt : '');
      };

      $rootScope.getPhoneNumberCssClass = function (phoneNumber) {

        if (!phoneNumber) {
          return;
        } else if (phoneNumber.typeNumber === 'OFFICE') {
          return 'icn-telephone';
        } else if (phoneNumber.typeNumber === 'MOBILE') {
          return 'icn-iphone';
        } else if (phoneNumber.typeNumber === 'FAX') {
          return 'icn-fax-machine';
        }
      };

      $rootScope.getUserName = function (user, includeImail) {
        if (user) {
          var username = user.firstName + ' ' + user.lastName;

          if (includeImail) {
            username += (' "' + user.primaryEmail + '"')
          }

          return username;
        }
      };

      $rootScope.getContactName = function (contact, includeImail) {
        if (contact) {
          var contactname = contact.firstName + ' ' + contact.lastName;

          if (includeImail) {
            contactname += (' "' + contact.email + '"')
          }

          return contactname;
        }
      };

      $rootScope.cancelEditForm = function () {
        $rootScope.$broadcast('cancelEditForm');
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

}());
