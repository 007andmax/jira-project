'use strict';

(function () {

  var app = angular.module("quicktech",
    [
      'main.services',
      'quicktech.core.ticketing',
      'quicktech.core.users',
      'quicktech.common.services',
      'quicktech.common.directives',
      'ui.router',
      'ui.select',
      'ui.bootstrap',
      'ngSanitize',
      'ngMessages'
    ]);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/tickets/unassigned');

    $stateProvider
      .state('Tickets', {
        url: '/tickets/:listType',
        templateUrl: '/html/quicktech/ticketing/views/ticketList.html',
        controller: 'TicketListController'
      })
      .state('Tickets.Detail', {
        url: '/:id',
        templateUrl: '/html/quicktech/ticketing/views/ticketDetail.html',
        controller: 'TicketDetailController'
      })
      .state('users', {
        url: '/users',
        templateUrl: '/html/scripts/core/users/users.tpl.html',
        controller: 'quicktech.core.users.usersCtrl'
      })
      .state('users.create', {
        url: '/create',
        templateUrl: '/html/scripts/core/users/user-edit.tpl.html',
        controller: 'quicktech.core.users.createUserCtrl'
      })
      .state('companies', {
        url: '/companies',
        templateUrl: '/html/scripts/core/companies/companies.tpl.html',
        controller: 'quicktech.core.companies.companiesCtrl'
      })
      .state('createCompany', {
        url: '/companies/create',
        templateUrl: '/html/scripts/core/companies/edit-company.tpl.html',
        controller: 'quicktech.core.companies.editCompanyCtrl'
      })
      .state('editCompany', {
        url: '/companies/edit/:companyId',
        templateUrl: '/html/scripts/core/companies/edit-company.tpl.html',
        controller: 'quicktech.core.companies.editCompanyCtrl'
      })

  }]);

  app.run(
    ['$rootScope', function ($rootScope) {
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
      }

    }]);

}());
