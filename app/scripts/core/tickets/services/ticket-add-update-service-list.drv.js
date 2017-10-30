'use strict';

(function () {
  angular.module("quicktech.core.tickets").directive("autocompleteServiceList",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          serviceList: "=",
          serviceItem: "=autocompleteServiceItem",
          entity: '=?'
        },
        // scope: { simpleAutocompleteData: '=simpleAutocomplete' },
        link: function ($scope, element, attrs) {

          var listContainer = $(element).nextAll('div.service-list-container');
          var autocompleteServiceList;

          $scope.$watch('serviceList.length', function () {
            var listBeforeSorting = [];
            if ($scope.serviceList && $scope.serviceList.length) {
              for (var i = 0; i < $scope.serviceList.length; i++) {
                listBeforeSorting.push({ 'value': $scope.serviceList[i].name, 'data': $scope.serviceList[i] });
              }
            }
            autocompleteServiceList = listBeforeSorting.sort(function (a, b) {
              return a.value.localeCompare(b.value);
            });

            $(element).autocomplete({
              lookup: autocompleteServiceList,
              appendTo: listContainer,
              minChars: 0,
              maxHeight: 170,
              maxWidth: 500,
              minWidth: 150,
              //listMarginTop: 6,
              // listPaddingTop: 10,
              // listPaddingBottom: 10,
              onSelect: function (suggestion) {
                $scope.serviceItem = angular.copy(suggestion.data);
                $('#selection').html('You selected: ' + suggestion.value);
                $scope.entity = suggestion.value;
              },
              showNoSuggestionNotice: true,
              noSuggestionNotice: 'Sorry, no matching results',
              showNoDataNotice: true,
              noDataNotice: 'Sorry, No data available.',
              preserveLastSelected: true,

              classes: {
                containerClass: 'uib-dropdown-menu dropdown-company',
                suggestion: 'company-item',
                selected: 'active',
                lastSelected: 'selected'
              },
              formatItem: function (result, suggestion) {
                return '<a href="javascript:void(0)">' + result + '</a>';
              },
              calculateWidth: function (result, suggestion) {
                var width = $.Autocomplete.getHtmlWidth('<div class="company-item"><a href="javascript:void(0)">' + result + '</a></div>');
                return width;
              },
            });
          });

        }
      }
    }]);
})();
