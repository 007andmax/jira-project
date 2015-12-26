'use strict';

(function () {
	angular.module("quicktech.core.tickets").directive("servicesMoving", 
	[function () {
		return {
		  	restrict: 'A',
		  	link: function ($scope, element, attrs) {

		  		var companies = $scope.companies;
          var companyServices = $scope.companyServices;

          element.servicesmoving({
            companies:      companies,
            companyServices:  companyServices,
            selectedServices:   [],
            onMoveService:    function(newCompanyServices){
              console.log(newCompanyServices);
            }
          });

	  		}
		}
  	}]);
})();