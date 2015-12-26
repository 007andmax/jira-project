'use strict';

(function () {
	angular.module('quicktech.core.tickets').directive("updateAddUser",
	[function () {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {

			var users = [];
			var getName = $scope.getUserName;
			var getEmail = getEmail = function(user){
				return user.primaryEmail;
			};
			var getAvatarUrl = $scope.getUserAvatarUrl;
			var updateAddUser = $scope.addUserToUpdate;

			switch ($scope.currentAddUserTab) {

			  case 'TEAM_MEMBER':
				users = $scope.agents;
				break;

			  case 'CLIENT_USER':
				users = $scope.clients;
				break;

			  case 'VENDOS':
				users = $scope.vendorsContacts;
				getEmail = function(user){
					return user.email;
				};
				getAvatarUrl = $scope.getContactAvatarUrl;
				updateAddUser = $scope.addContactToUpdate;
				break;
			}

			var inputElement = $(element).find('input');
			var actionElement = inputElement.parents('.form-group').find('div.label-add-btn > div');

			// A fix to re-calculate height and focus the input
			inputElement.parents('div.dropdown').on('shown.bs.dropdown', function () {
				inputElement.val('').autocomplete('onValueChange', true).focus();
			});

			// Initialize autocomplete plugin
			inputElement.autocomplete({
				appendTo: 	$(element).find('.scroll-pane'),
				minChars:             0,
				maxHeight:            204,
				forceFixPosition:     false,
				listPaddingTop:       10,
				listPaddingBottom:    10,
				showNoSuggestionNotice:true,
				noSuggestionNotice:   'No results found',
				showNoDataNotice:     true,
				noDataNotice:         'No results found',
				preserveLastSelected: true,
				preventSelection: true,
				alwaysShow:           true,

				classes: {
					containerClass: 'users-list',
					suggestion:     'user-item',
					selected:       'hovered',
					lastSelected:   'active'
				},
				lookup: function(query, done) {
					if( query.indexOf('@') !== -1 ) {
					  query = '';
					}
					var data = {suggestions: []};
					var queryLowerCase = query.toLowerCase();
					for(var i=0; i<users.length; i++) {
						if( $scope.filterUpdateUser(users[i]) ) {

							var name = getName(users[i]);

							if( name.toLowerCase().indexOf(queryLowerCase) !== -1) {
							  data.suggestions.push({value: name, data: users[i]})
							}
						}
					}
					done(data);
				},
				formatItem: function(result, suggestion) {
					var avatarUrl = getAvatarUrl($scope.getUserById(suggestion.data.id));

					// Preload avatar
					var image = new Image();
					image.src = avatarUrl;

					return '<label class="control checkbox"> \
						<input type="checkbox" '+($scope.selectUpdateSharedUser[suggestion.data.id]?'checked="checked"':'')+'> \
						<span class="control-indicator"></span> \
						<a href="" class="pull-left avatar"> \
						  <img src="'+avatarUrl+'" alt="..." class="img-circle avatar-26"> \
						</a> \
						<span class="user-name">'+result+' “'+getEmail(suggestion.data)+'”</span> \
					</label>';
				},
				calculateWidth: function(result, suggestion){
					var width = $.Autocomplete.getHtmlWidth('<div class="user-item"> \
						<label class="control checkbox"> \
						  <input type="checkbox"> \
						  <span class="control-indicator"></span> \
						  <a href="" class="pull-left avatar"> \
							<img src="assets/images/avatars/a4.jpg" alt="..." class="img-circle avatar-26"> \
						  </a> \
						<span class="user-name"><b>'+result+'</b> “'+getEmail(suggestion.data)+'”</span> \
						</label>\
					  </div>');
					return width;
				},
				onSelectAction: function(element, suggestion){
					var checkbox = element.find('input');
					checkbox.prop("checked", !checkbox.prop("checked"));

					$scope.$apply(function() {
						$scope.selectUpdateSharedUser[suggestion.data.id] = !$scope.selectUpdateSharedUser[suggestion.data.id];
						updateAddUser(suggestion.data);
					});
				},
			}).autocomplete('onValueChange', true).focus();
		}
	}
  }]);
})();
