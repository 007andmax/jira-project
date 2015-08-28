'use strict';

(function () {

  angular.module("quicktech.core.vendors").directive("contactsSlider",
    ['$state', '$modal', '$rootScope',
      function ($state, $modal, $rootScope) {
        return {
          restrict: 'A',
          require: 'ngModel',
          templateUrl: '/html/scripts/core/vendors/contact-slider.tpl.html',
          scope: {},
          link: function ($scope, element, attrs, ctrl) {

            var shownId;

            $scope.getUserName = $rootScope.getUserName;

            $scope.getPhoneWithLowestNumber = function (phoneNumbers) {
              var priority;
              var index;
              for (var i = 0; i < phoneNumbers.length; i++) {
                if (priority === undefined || phoneNumbers[i].priority < priority) {
                  priority = phoneNumbers[i].priority;
                  index = i;
                }
              }
              return phoneNumbers[index];
            };

            $scope.$watch('ngModel', function () {
              if (!$scope.contacts) {
                shownId = ctrl.$viewValue[0].id;
              }

              $scope.contacts = ctrl.$viewValue;
            });

            $scope.contactsOrder = function (contact) {
              if (contact.id === shownId) {
                return -1;
              } else {
                var shownIndex = getContactIndex(shownId),
                  contactIndex = getContactIndex(contact.id);

                if (contactIndex < shownIndex) {
                  return contactIndex + $scope.contacts.length;
                }

                return contactIndex;
              }
            };

            $scope.showNext = function (id) {

              if (shownId === id) {
                return;
              }

              var slides = element.find('[cs-slide]'),
                nextSlide = $(slides[1]),
                right = 22;

              //prevSlide.fadeOut(0);
              nextSlide.addClass("un");

              nextSlide.animate({right: right}, {
                duration: 100,
                complete: function () {

                  setTimeout(function () {
                    slides.removeClass('active');
                    slides.addClass('nactive');

                    nextSlide.addClass('active');
                    nextSlide.removeClass('nactive');
                    nextSlide.css("right", "");
                    nextSlide.removeClass("un");

                    $scope.$apply(function () {
                      shownId = id;
                    })
                  }, 300);

                }
              });
            };

            function getContactIndex(contactId) {
              for (var i = 0; i < $scope.contacts.length; i++) {
                if (contactId === $scope.contacts[i].id) {
                  return i;
                }
              }

              return -1;
            }
          }
        }
      }]);
})();
