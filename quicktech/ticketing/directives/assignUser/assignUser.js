'use strict';

(function(){
	var app = angular.module('quicktech.ticketing');

	app.directive('AssignUser', function(){
		return {
			restrict: 'E',
			templateUrl: 'view.html'
		}
	});


})();