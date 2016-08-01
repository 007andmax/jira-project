'use strict';

(function () {
  angular.module("quicktech.core.settings").directive("googleMap", function () {
    return {
      restrict: 'A',
      scope: {
        latitude: '=',
        longitude: '=',
        title: '@'
      },
      link: function (scope, element) {
        var map, marker,
          defaultPosition = { lat: 0, lng: 0 };

        element.css({ width: '500px', height: '300px' });

        map = new google.maps.Map(element[0], {
          center: defaultPosition,
          scrollwheel: true,
          zoom: 1
        });

        marker = new google.maps.Marker({
          map: map,
          position: defaultPosition,
          title: scope.title
        });

        scope.$watchCollection('[latitude, longitude]', function (coordinates) {
          resetMap(coordinates);
        });

        function resetMap(coordinates) {
          var position = { lat: coordinates[0], lng: coordinates[1] },
            hasCoordinates = coordinates[0] != undefined && coordinates[1] != undefined;

          if (hasCoordinates) {
            marker.setPosition(position);
            marker.setTitle(scope.title);
            marker.setVisible(true);
            map.setCenter(position);
            map.setZoom(15);
          } else {
            marker.setVisible(false);
            map.setCenter(defaultPosition);
            map.setZoom(1);
          }
        }
      }
    }
  });
})();
