'use strict';

(function () {
	angular.module("quicktech.core.tickets").directive("servicesMoving", 
	['$timeout', function ($timeout) {
		return {
		  	restrict: 'A',
		  	link: function ($scope, element, attrs) {
          $timeout(function(){
  		  		var companies = $scope.companies;

            $scope.$watch("companyServices", function(){
              if(!$.isEmptyObject($scope.companyServices)){
                $(element).servicesmoving({
                  minWidth: 260,
                  companies:      $scope.companies,
                  companyServices:  $scope.companyServices,
                  selectedServices:   [],
                  onMoveService:    function(newCompanyServices){
                    console.log(newCompanyServices);
                  }
                });

                $(element).parent().on('shown.bs.dropdown', function(){
                    $(element).servicesmoving('setSelectedServices', $scope.getCheckedDefaultServices());
                    $(element).servicesmoving('suggest');
                }); 
              }
            });
          }, 0);
	  		}
		}
  	}]);
})();