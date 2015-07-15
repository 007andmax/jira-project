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
      'ui.router',
      'ui.select',
      'ui.bootstrap',
      'ngSanitize',
      'ngMessages',
      'ngAnimate'
    ]);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/tickets/unassigned');

    $stateProvider
      .state('Tickets', waitForServices({
        url: '/tickets/:listType',
        templateUrl: '/html/quicktech/ticketing/views/ticketList.html',
        controller: 'TicketListController'
      }))
      .state('Tickets.Detail', waitForServices({
        url: '/:id',
        templateUrl: '/html/quicktech/ticketing/views/ticketDetail.html',
        controller: 'TicketDetailController'
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
            username += ('"' + user.primaryEmail + '"')
          }

          return username;
        }
      };

      $templateCache.put("template/typeahead/typeahead-popup.html",
        "<ul class=\"dropdown-menu\" qt-typeahead-styler ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
        "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
        "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
        "    </li>\n" +
        "</ul>\n" +
        "");
    }]);

}());
