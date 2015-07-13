'use strict';

(function(){
	var app = angular.module('quicktech.core.tickets');

	app.filter('TicketsFilter', function() {

		return function(input, testFilter) {
			var out = [];
			angular.forEach(input, function(ticket) {
				if(testFilter === undefined) {
					out = input;
				} else {
					if(ticket.subject.toLowerCase().indexOf(testFilter.query.toLowerCase()) !== -1){
						out.push(ticket)
					}
				}
			});
			return out;
		};
	});



	app.filter('UserFilter', function() {

		return function(input, userQuery) {
			//console.log(userQuery);
			var out = [];
			angular.forEach(input, function(user) {
				if(userQuery === undefined) {
					out = input;
				} else {
					if (user.firstName.toLowerCase().indexOf(userQuery.query)!=-1 ||
						user.lastName.toLowerCase().indexOf(userQuery.query)!=-1) {
						out.push(user);
				}
			}
		});
			return out;
		};
	});



})();
