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
        element.css({ width: '500px', height: '300px' });

        scope.$watchCollection('[latitude, longitude]', function (coordinates) {
          if (coordinates[0] !== undefined && coordinates[1] !== undefined) {
            initMap(coordinates);
          }
        });

        function initMap(coordinates) {
          var myLatLng = {lat: coordinates[0], lng: coordinates[1]};

          var map = new google.maps.Map(element[0], {
            center: myLatLng,
            scrollwheel: true,
            zoom: 15
          });

          new google.maps.Marker({
            map: map,
            position: myLatLng,
            title: scope.title
          });
        }
      }
    }
  });
})();
