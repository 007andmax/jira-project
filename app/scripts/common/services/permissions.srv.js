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
        var isTrueForOpen = listType === LIST_TYPES.OPEN;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen;
      }

      function isMoveIntoSpamVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && userRole === USER_ROLES.USER;

        return isTrueForUnassigned;
      }

      function isAssignTicketToVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen;
      }

      function isLabelAsVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose;
      }

      function isMoveToTrashVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose;
      }

      function isChangePriorityToVisible(listType, userRole, option) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && !option;
        var isTrueForUser = listType === LIST_TYPES.USER && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) && option;
        var isTrueForOpen = listType === LIST_TYPES.OPEN && option;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen;
      }

      function isTagsVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN);
        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;

        return isTrueForUnassigned || isTrueForUser || isTrueForOpen || isTrueForClose;
      }

      function isChangeStatusToVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;

        return isTrueForUser || isTrueForOpen;
      }

      function isClaimTicketVisible(listType, userRole) {

        var isTrueForUnassigned = listType === LIST_TYPES.UNASSIGNED;

        return isTrueForUnassigned;
      }

      function isStatusVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;

        return isTrueForUser || isTrueForOpen || isTrueForClose;
      }

      function isUpdateAndCloseVisible(listType, userRole) {

        var isTrueForUser = listType === LIST_TYPES.USER;
        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;

        return isTrueForUser || isTrueForOpen || isTrueForClose;
      }

      function isInitialsVisible(listType, userRole) {

        var isTrueForOpen = listType === LIST_TYPES.OPEN;
        var isTrueForClose = listType === LIST_TYPES.CLOSE;

        return isTrueForOpen || isTrueForClose;
      }

      function isSendToSpamVisible(listType, userRole) {

        var isFalseForClose = listType !== LIST_TYPES.CLOSE;

        return isFalseForClose;
      }

      function isCreateTicketUpdateVisible(listType, userRole) {

        var isTrue = listType === LIST_TYPES.USER && listType !== LIST_TYPES.SHARED && listType !== LIST_TYPES.OPEN;

        return isTrue;
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
        isUpdateAndCloseVisible: isUpdateAndCloseVisible,
        isInitialsVisible: isInitialsVisible,
        isSendToSpamVisible: isSendToSpamVisible,
        isCreateTicketUpdateVisible: isCreateTicketUpdateVisible
      }

    }]);

})(window, jQuery);


