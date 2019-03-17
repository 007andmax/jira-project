'use strict';

(function () {
  angular.module("quicktech.core.settings").directive("googleMap",
    ['quicktech.common.services.GoogleMapService',
      function (GoogleMapService) {
        return {
          restrict: 'A',
          scope: {
            latitude: '=',
            longitude: '=',
            title: '@'
          },
          link: function (scope, element) {
            var map, marker,
              defaultPosition = {lat: 0, lng: 0};

            element.css({width: '500px', height: '300px'});

            var googleData = GoogleMapService.createMap(element);

            map = googleData.map;
            marker = googleData.marker;
            marker.setTitle(scope.title);

            scope.$watchCollection('[latitude, longitude]', function (coordinates) {
              resetMap(coordinates);
            });

            function resetMap(coordinates) {
              var position = {lat: coordinates[0], lng: coordinates[1]},
                hasCoordinates = coordinates[0] != undefined && coordinates[1] != undefined;

              if (hasCoordinates) {
                GoogleMapService.setCenter(position);
                marker.setTitle(scope.title);
                marker.setVisible(true);
                map.setZoom(15);
              } else {
                marker.setVisible(false);
                map.setCenter(defaultPosition);
                map.setZoom(1);
              }
            }
          }
        }
      }
    ]);
})();
