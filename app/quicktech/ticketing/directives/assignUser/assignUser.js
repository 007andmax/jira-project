'use strict';

(function(){
	var app = angular.module('quicktech.core.tickets');

	app.directive('assignUser', function(){
		return {
			restrict: 'E',
			templateUrl: 'view.html'
		}
	});


})();
