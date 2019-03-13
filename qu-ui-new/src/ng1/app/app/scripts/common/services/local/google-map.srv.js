'use strict';

(function () {

  angular.module('quicktech.common.services').factory('quicktech.common.services.GoogleMapService', ['$timeout',
    function ($timeout) {

      var mapDiv = $('<div map-conteiner style="height:100%;"></div>');
      var alternativeMapDiv = $('<div map-conteiner style="height:100%;" alternative></div>');

      var defaultZoom = 15,
        defaultCenter = new google.maps.LatLng(41.9955835, -93.63813119999998),
        mapOptions = {
          center: defaultCenter,
          zoom: defaultZoom,
          zoomControl: true,
          scaleControl: true,
          scrollwheel: true,
          streetViewControl: false,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
          }
        };

      var map = new google.maps.Map(mapDiv[0], mapOptions);
      var alternativeMap = new google.maps.Map(alternativeMapDiv[0], mapOptions);

      var marker = new google.maps.Marker({
        map: map,
        position: defaultCenter
      });
      var alternativeMarker = new google.maps.Marker({
        map: alternativeMap,
        position: defaultCenter
      });

      function createMap(mapElement, centerLatLng, useAlternative) {
        var center;

        if (centerLatLng) {
          center = new google.maps.LatLng(centerLatLng.lat, centerLatLng.lng);
        }

        mapElement.css('opacity', '0');

        if (useAlternative) {
          alternativeMapDiv.appendTo(mapElement);
        } else {
          mapDiv.appendTo(mapElement);
        }

        if (center) {
          if (useAlternative) {
            alternativeMarker.setPosition(center);
          } else {
            marker.setPosition(center);
          }
        }

        if (useAlternative) {
          google.maps.event.trigger(alternativeMap, 'resize');
        } else {
          google.maps.event.trigger(map, 'resize');
        }

        $timeout(function () {
          if (center) {
            if (useAlternative) {
              alternativeMap.setCenter(center);
            } else {
              map.setCenter(center);
            }
          }
          mapElement.animate({
            opacity: 1
          }, 400);
        }, 0);

        if (useAlternative) {
          return {
            map: alternativeMap,
            marker: alternativeMarker
          };
        } else {
          return {
            map: map,
            marker: marker
          };
        }
      }

      function setCenter(centerLatLng, useAlternative) {
        var center = new google.maps.LatLng(centerLatLng.lat, centerLatLng.lng);

        if (useAlternative) {
          alternativeMap.setCenter(center);
          alternativeMarker.setPosition(center);
        } else {
          map.setCenter(center);
          marker.setPosition(center);
        }
      }

      return {
        createMap: createMap,
        setCenter: setCenter
      }

    }]);

})();
