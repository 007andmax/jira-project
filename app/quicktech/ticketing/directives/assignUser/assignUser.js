'use strict';

(function(){
	var app = angular.module('quicktech.ticketing');

	app.directive('assignUser', function(){
		return {
			restrict: 'E',
			templateUrl: 'view.html'
		}
	});


})();
