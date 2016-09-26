'use strict';

(function () {

  angular.module('quicktech.common.services').factory('quicktech.common.services.GoogleMapService', ['$timeout',
    function ($timeout) {

      var mapDiv = $('<div map-conteiner style="height:100%;"></div>');

      var defaultZoom = 15,
        defaultCenter = new google.maps.LatLng(41.9955835, -93.63813119999998),
        mapOptions = {
          center: defaultCenter,
          zoom: defaultZoom,
          zoomControl: true,
          scaleControl: true,
          scrollwheel: false,
          streetViewControl: false,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
          }
        };

      var map = new google.maps.Map(mapDiv[0], mapOptions);
      var marker = new google.maps.Marker({
        map: map,
        position: defaultCenter
      });

      function createMap(mapElement, centerLatLng) {
        var center;

        if (centerLatLng) {
          center = new google.maps.LatLng(centerLatLng.lat, centerLatLng.lng);
        }

        mapElement.css('opacity', '0');

        mapDiv.appendTo(mapElement);

        if (center) {
          marker.setPosition(center);
        }

        google.maps.event.trigger(map, 'resize');

        $timeout(function () {
          if (center) {
            map.setCenter(center);
          }
          mapElement.animate({
            opacity: 1
          }, 400);
        }, 0);

        return {
          map: map,
          marker: marker
        };
      }

      function setCenter(centerLatLng) {
        var center = new google.maps.LatLng(centerLatLng.lat, centerLatLng.lng);

        map.setCenter(center);
        marker.setPosition(center);
      }

      return {
        createMap: createMap,
        setCenter: setCenter
      }

    }]);

})();


