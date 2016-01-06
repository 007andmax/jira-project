'use strict';

(function () {
	angular.module("quicktech.core.tickets").directive("servicesMoving", 
	['$timeout', function ($timeout) {
		return {
		  	restrict: 'A',
		  	link: function ($scope, element, attrs) {
          $timeout(function(){

            $(element).servicesmoving({
              minWidth: 260,
              companies:      $scope.companies,
              companyServices:  [],
              selectedServices:   [],
              onMoveService:    function(newCompanyServices){
                $scope.moveServices(newCompanyServices);
              }
            });

            $scope.$watch("companyServices", function(){
              if(!$.isEmptyObject($scope.companyServices)){
                $(element).servicesmoving('setCompanyServices', $scope.companyServices);
              }
            });

            $(element).parent().on('shown.bs.dropdown', function(){
                $(element).servicesmoving('setSelectedServices', $scope.getCheckedDefaultServices());
                $(element).servicesmoving('suggest');
            });
          }, 0);
	  		}
		}
  	}]);
})();