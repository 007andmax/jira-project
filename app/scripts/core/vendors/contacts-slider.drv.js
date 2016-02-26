'use strict';

(function () {

  angular.module("quicktech.core.vendors").directive("contactsSlider",
    ['$state', '$modal', '$rootScope',
      function ($state, $modal, $rootScope) {
        return {
          restrict: 'A',
          require: 'ngModel',
          templateUrl: '/html/scripts/core/vendors/contact-slider.tpl.html',
          scope: {
            contacts: '=ngModel'
          },
          link: function ($scope, element, attrs, ctrl) {

            var shownId;

            $scope.getUserName = $rootScope.getUserName;
            $scope.getContactAvatarUrl = $rootScope.getContactAvatarUrl;

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

            $scope.$watch(function () {
              return shownId
            }, function () {
              if ((ctrl.$viewValue && ctrl.$viewValue.length > 0) && !shownId) {
                shownId = ctrl.$viewValue[0].id;
              }
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
                curSlide = $(slides[0]),
                nextSlide = $(slides[1]),
                curSlideHideData = curSlide.find('[contact-hide-info]'),
                nextSlideHideData = nextSlide.find('[contact-hide-info]'),
                right = slides.width() - 58;

              curSlide.fadeOut(0);
              curSlideHideData.fadeOut(0);
              nextSlide.addClass("un");

              nextSlide.animate({right: right}, {
                duration: 200,
                complete: function () {

                  setTimeout(function () {
                    slides.removeClass('active');
                    slides.addClass('nactive');

                    nextSlide.addClass('active');
                    nextSlide.removeClass('nactive');
                    nextSlide.css("right", "");
                    nextSlide.removeClass("un");

                    curSlide.fadeIn(0);
                    nextSlideHideData.fadeIn(500);

                    $scope.$apply(function () {
                      shownId = id;
                    })
                  }, 300);

                }
              });
            };

            $scope.initializeContact = function (index) {
              if (index === 0)
                element.find('[cs-slide]:first').find('[contact-hide-info]').fadeIn(0);

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
