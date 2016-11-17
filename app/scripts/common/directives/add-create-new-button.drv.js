'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('addCreateNewButton',
    ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var typeahead = element.find('[uib-typeahead]'),
            newScope = $scope.$new($scope);
          typeahead.attr('typeahead-no-results', 'createNew' + attrs.addCreateNewButton + newScope.$id);

          $timeout(function () {
            var dropdown = element.find('.dropdown-menu'),
              createNewButton;

            if (dropdown.length) {
              if (dropdown[0].nodeName.toLowerCase() === 'ul') {
                createNewButton = document.createElement('li');
              } else {
                createNewButton = document.createElement('div');
              }

              createNewButton.setAttribute('create-new-entity', attrs.addCreateNewButton || 'ticket');
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
