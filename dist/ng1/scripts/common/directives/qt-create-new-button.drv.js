'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtAddCreateNewButton',
    ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var input = angular.element( document.querySelector( '#qtInput' ) ),
            newScope = $scope.$new($scope);
          input.attr('typeahead-no-results', 'createNew' + attrs.qtAddCreateNewButton + newScope.$id);

          $timeout(function () {
            var dropdown = element.find('.dropdown-content'),
              createNewButton;

            if (dropdown.length) {
              if (dropdown[0].nodeName.toLowerCase() === 'ul') {
                createNewButton = document.createElement('li');
              } else {
                createNewButton = document.createElement('div');
              }

              createNewButton.setAttribute('create-new-entity', attrs.qtAddCreateNewButton || 'ticket');
              var createNewText = document.createElement('a');
              createNewText.innerHTML = 'Create New';
              createNewText.style['text-align'] = 'center';
              createNewButton.appendChild(createNewText);
              $compile(createNewButton)(newScope, function (compiledHtml) {
                dropdown.prepend(compiledHtml);
              });
            }
          })
        }
      }
    }]);
})();
