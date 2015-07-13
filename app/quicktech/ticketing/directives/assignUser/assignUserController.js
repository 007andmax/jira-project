'use strict';

(function(){

	var app = angular.module('quicktech.core.tickets');

	app.controller('AssignUserController', function($scope) {

		//dataFactory.get('states.json').then(function(data) {
		//	$scope.items = data;
		//});

		$scope.items = [{
			"name": "Alabama",
			"abbreviation": "AL"
		},{
			"name": "Alabama 1",
			"abbreviation": "AL"
		},{
			"name": "Alabama 2",
			"abbreviation": "AL"
		},{
			"name": "Alabama 3",
			"abbreviation": "AL"
		}];

		$scope.name = ''; // This will hold the selected item
			$scope.onItemSelected = function() { // this gets executed when an item is selected
				console.log('selected=' + $scope.name);
			};
		});



})();
