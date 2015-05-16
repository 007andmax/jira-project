
(function(){
	'use strict';	
	
	var app = angular.module("quicktech.ticketing", ['main.services', 'ui.router', 'ngSanitize', 'smoothScroll']);

	app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/tickets/unassigned');

		$stateProvider
		.state("Tickets", {
			url: '/tickets/:listType',
			templateUrl: 'html/quicktech/ticketing/views/ticketList.html',
			controller: 'TicketListController',
			resolve : {
				CompaniesService : 'CompaniesService',
				UsersService : 'UsersService'
			}
		})
		.state("Tickets.Detail", {
			url: '/:id',
			templateUrl: 'html/quicktech/ticketing/views/ticketDetail.html',
			controller: 'TicketDetailController'/*,
			onEnter: function(){
			    $('.ticket-content > div').hide();
			}*/
		});

	}])
	
}());