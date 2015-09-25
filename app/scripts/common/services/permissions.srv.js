'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.PermissionsService',
    [function () {

      var USER_ROLES = {
        USER : 'USER',
        ADMIN: 'ADMIN',
        SUPER_ADMIN: 'SUPER_TECH_ADMIN'
      };

      var LIST_TYPES = {
        UNASSIGNED : 'unassigned',
        USER: 'user',
        SHARED: 'shared',
        OPEN: 'open',
        CLOSE: 'closed',
        TRASH: 'trash',
        SPAM: 'spam'
      };

      function isMoreActionsMenuVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUnassigned || isTrueForUser;
      }

      function isMoveIntoSpamVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && userRole === USER_ROLES.USER;

        return isTrueForUnassigned;
      }

      function isAssignTicketToVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUnassigned || isTrueForUser;
      }

      function isLabelAsVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUnassigned || isTrueForUser;
      }

      function isMoveToTrashVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);

        return isTrueForUnassigned || isTrueForUser;
      }

      function isChangePriorityToVisible(listType, userRole, option) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && !option;
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && option;

        return isTrueForUnassigned || isTrueForUser;
      }

      function isTagsVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUnassigned || isTrueForUser;
      }

      function isChangeStatusToVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUser;
      }

      function isClaimTicketVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED;

        return isTrueForUnassigned;
      }

      function isStatusVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUser;
      }

      function isUpdateAndCloseVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;

        return isTrueForUser;
      }

      return {
        isMoreActionsMenuVisible: isMoreActionsMenuVisible,
        isMoveIntoSpamVisible: isMoveIntoSpamVisible,
        isAssignTicketToVisible: isAssignTicketToVisible,
        isLabelAsVisible: isLabelAsVisible,
        isChangePriorityToVisible: isChangePriorityToVisible,
        isMoveToTrashVisible: isMoveToTrashVisible,
        isTagsVisible: isTagsVisible,
        isChangeStatusToVisible: isChangeStatusToVisible,
        isClaimTicketVisible: isClaimTicketVisible,
        isStatusVisible: isStatusVisible,
        isUpdateAndCloseVisible: isUpdateAndCloseVisible
      }

    }]);

})(window, jQuery);


