'use strict';

(function(){
	var app = angular.module('quicktech.core.ticketing');

	app.directive('assignUser', function(){
		return {
			restrict: 'E',
			templateUrl: 'view.html'
		}
	});


})();
