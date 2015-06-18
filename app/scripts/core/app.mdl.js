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
      'ngSanitize'
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
        templateUrl: '/html/scripts/core/users/user-edit.tpl.html'
      });

  }]);

}());
