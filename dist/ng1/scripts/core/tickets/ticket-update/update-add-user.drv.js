'use strict';

(function () {
  angular.module('quicktech.core.tickets').directive("updateAddUser",
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

          var updateAddUser = $scope.addUserToUpdate;
          var getUsers = function (type) {

            var users = [];
            var getName = $scope.getUserName;
            var getEmail = function (user) {
              return user.primaryEmail;
            };
            var getAvatarUrl = $scope.getUserAvatarUrl;

            switch (type) {

              case 'TEAM_MEMBER':
                users = $scope.agents;
                break;

              case 'CLIENT_USER':
                users = $scope.clients;
                break;
            }

            return {
              data: users,
              getName: getName,
              getEmail: getEmail,
              getAvatarUrl: getAvatarUrl
            }

          }

          var types = ['TEAM_MEMBER', 'CLIENT_USER'];
          var users;
          var maxProductWidth = 0;

          for (var i in types) {
            var typeUsers = getUsers(types[i]);

            if ($scope.currentAddUserTab == types[i]) {
              users = typeUsers;
            }

            for (var j = 0; j < typeUsers.data.length; j++) {
              var user = typeUsers.data[j];
              var avatarUrl = typeUsers.getAvatarUrl($scope.getUserById(user.id));
              var image = new Image();
              image.src = avatarUrl;

              var width = $.Autocomplete.getHtmlWidth('<div class="user-item"> \
						<label class="control checkbox"> \
						  <input type="checkbox"> \
						  <span class="control-indicator"></span> \
						  <a href="" class="pull-left avatar"> \
							<img src="' + avatarUrl + '" alt="..." class="img-circle avatar-26"> \
						  </a> \
						<span class="user-name ellipsis"><b>' + typeUsers.getName(user) + '</b> “' + typeUsers.getEmail(user) + '”</span> \
						</label>\
					  </div>');
              if (width >= maxProductWidth) {
                maxProductWidth = width;
              }
            }
          }

          // $(element).parents('ul.dropdown-menu').css({
          // 	'width': 	maxProductWidth + 10,
          // 	'max-width':maxProductWidth + 10
          // });

          var inputElement = $(element).find('input');
          var actionElement = inputElement.parents('.form-group').find('div.label-add-btn > div');

          // A fix to re-calculate height and focus the input
          inputElement.parents('div.dropdown').on('shown.bs.dropdown', function () {
            inputElement.val('').autocomplete('onValueChange', true);
          });

          // Initialize autocomplete plugin
          inputElement.autocomplete({
            appendTo: $(element).find('.scroll-pane'),
            minChars: 0,
            maxHeight: 204,
            width: maxProductWidth + 10,
            forceFixPosition: false,
            listPaddingTop: 10,
            listPaddingBottom: 10,
            showNoSuggestionNotice: true,
            noSuggestionNotice: 'No results found',
            showNoDataNotice: true,
            noDataNotice: 'No results found',
            preserveLastSelected: true,
            preventSelection: true,
            alwaysShow: true,

            classes: {
              containerClass: 'users-list',
              suggestion: 'user-item',
              selected: 'hovered',
              lastSelected: 'active'
            },
            lookup: function (query, done) {
              if (query.indexOf('@') !== -1) {
                query = '';
              }
              var data = { suggestions: [] };
              var queryLowerCase = query.toLowerCase();
              for (var i = 0; i < users.data.length; i++) {
                var user = users.data[i];
                if (!user.deletedAt) {
                  if ($scope.filterUpdateUser(user)) {
                    var name = users.getName(user);

                    if (name.toLowerCase().indexOf(queryLowerCase) !== -1) {
                      data.suggestions.push({ value: name, data: user })
                    }
                  }
                }
              }
              done(data);
            },
            formatItem: function (result, suggestion) {
              var avatarUrl = users.getAvatarUrl($scope.getUserById(suggestion.data.id));
              var image = new Image();
              image.src = avatarUrl;

              return '<label class="control checkbox"> \
						<input type="checkbox" ' + ($scope.selectUpdateSharedUser[suggestion.data.id] ? 'checked="checked"' : '') + '> \
						<span class="control-indicator"></span> \
						<a href="" class="pull-left avatar"> \
						  <img src="' + avatarUrl + '" alt="..." class="img-circle avatar-26"> \
						</a> \
						<span class="user-name ellipsis">' + result + ' “' + users.getEmail(suggestion.data) + '”</span> \
					</label>';
            },
            calculateWidth: function (result, suggestion) {
              var avatarUrl = users.getAvatarUrl($scope.getUserById(suggestion.data.id));
              var image = new Image();
              image.src = avatarUrl;

              var width = $.Autocomplete.getHtmlWidth('<div class="user-item"> \
						<label class="control checkbox"> \
						  <input type="checkbox"> \
						  <span class="control-indicator"></span> \
						  <a href="" class="pull-left avatar"> \
							<img src="' + avatarUrl + '" alt="..." class="img-circle avatar-26"> \
						  </a> \
						<span class="user-name ellipsis"><b>' + result + '</b> “' + users.getEmail(suggestion.data) + '”</span> \
						</label>\
					  </div>');
              return width;
            },
            onSelectAction: function (element, suggestion) {
              var checkbox = element.find('input');
              checkbox.prop("checked", !checkbox.prop("checked"));

              $scope.$apply(function () {
                $scope.selectUpdateSharedUser[suggestion.data.id] = !$scope.selectUpdateSharedUser[suggestion.data.id];
                updateAddUser(suggestion.data);
              });
            },
          }).autocomplete('onValueChange', true);
        }
      }
    }]);
})();
