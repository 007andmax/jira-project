'use strict';

(function () {

  var app = angular.module("quicktech",
    [
      'main.services',
      'quicktech.ticketing',
      'quicktech.common.services',
      'ui.router',
      'ngSanitize'
    ]);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/tickets/unassigned');

    $stateProvider
      .state("Tickets", {
        url: '/tickets/:listType',
        templateUrl: '/html/quicktech/ticketing/views/ticketList.html',
        controller: 'TicketListController'
      })
      .state("Tickets.Detail", {
        url: '/:id',
        templateUrl: '/html/quicktech/ticketing/views/ticketDetail.html',
        controller: 'TicketDetailController'
      });

  }])

}());
