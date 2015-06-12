'use strict';

/* Services */

(function (window, $, undefined) {

    var app = angular.module('quicktech.core.ticketing');

    app.factory('ActionRightsService', function () {

        var USER_ROLES = {
            USER : 'USER',
            ADMIN: 'ADMIN'
        };

        var FILTERS = {
            UNASSIGNED : 'unassigned',
            USER: 'user',
            SHARED: 'shared',
            OPEN: 'open',
            CLOSE: 'closed',
            TRASH: 'trash',
            SPAM: 'spam'
        };

        function isMoreActionsMenuVisible(filter, userRole) {
            var isTrueForFilter = filter === FILTERS.USER || filter === FILTERS.OPEN;
            var isTrueForShared = filter === FILTERS.SHARED && userRole !== USER_ROLES.USER;
            var isTrueForUnassigned = filter === FILTERS.UNASSIGNED && userRole !== USER_ROLES.USER;

            return isTrueForFilter || isTrueForShared || isTrueForUnassigned;
        }

        function isLabelAsVisible(filter, userRole) {

            var isTrueForFilter = filter != FILTERS.TRASH && filter!= FILTERS.SPAM &&
            filter != FILTERS.SHARED && filter != FILTERS.UNASSIGNED;

            var isTrueForShared = filter === FILTERS.SHARED && userRole !== USER_ROLES.USER;
            var isTrueForUnassigned = filter === FILTERS.UNASSIGNED && userRole !== USER_ROLES.USER;

            return isTrueForFilter || isTrueForShared || isTrueForUnassigned;
        }

        function isClaimTicketVisible(filter, assignedUser) {
            return filter !== FILTERS.TRASH && filter !== FILTERS.SPAM && assignedUser === null;
        }

        function isPriorityVisible(filter) {
            return filter === FILTERS.UNASSIGNED;
        }

        function isPriorityIconVisible(filter, userRole) {

            var isTrueForOpen = filter === FILTERS.OPEN;
            var isTrueForShared = filter === FILTERS.SHARED && userRole !== USER_ROLES.USER;
            var isTrueForUser = filter === FILTERS.USER && userRole !== USER_ROLES.USER;

            return isTrueForOpen || isTrueForShared || isTrueForUser;
        }

        function isPriorityForDetailPageVisible(filter, userRole) {
            return (isPriorityVisible(filter) && userRole == USER_ROLES.ADMIN) || isPriorityIconVisible(filter, userRole);
        }

        function isChangeStatusVisible(filter) {
            return filter === FILTERS.SHARED || filter === FILTERS.OPEN || filter === FILTERS.USER;
        }

        function isMoveToTrashVisible(filter, userRole) {
            return filter !== FILTERS.USER || (filter === FILTERS.USER && userRole !== USER_ROLES.USER)
        }

        function isMoveToTrashIconVisible(filter) {

            var isClosed = filter === FILTERS.CLOSE;
            return isClosed;
        }

        function isDeleteSpamForAdminVisible(filter, ticketMarkedSpamByRole, currentUserRole) {
            return filter === FILTERS.SPAM && ticketMarkedSpamByRole === USER_ROLES.ADMIN &&
            currentUserRole !== USER_ROLES.USER;
        }

        function isMoveToTrashDetailedVisible(filter, ticketMarkedSpamByRole, currentUserRole) {
            return (isMoveToTrashIconVisible(filter, ticketMarkedSpamByRole, currentUserRole) ||
                isMoveToTrashVisible(filter, currentUserRole)) && currentUserRole !== USER_ROLES.USER;
        }

        function isMoveToTrashForeverIconVisible(filter) {
            return filter === FILTERS.TRASH;
        }

        function isRestoreForTrashVisible(filter) {
            return filter === FILTERS.TRASH;
        }

        function isRestoreForSpamVisible(filter) {
            return filter === FILTERS.SPAM;
        }

        function isMarkAsSpamIconVisible(filter, ticketMarkedSpamByRole, currentUserRole) {
            var isTrueForUnassigned = filter === FILTERS.UNASSIGNED && currentUserRole === USER_ROLES.USER;
            var isRolesCheckTrue = filter == FILTERS.SPAM && ticketMarkedSpamByRole !== USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.USER;

            return isTrueForUnassigned || isRolesCheckTrue;
        }

        function isMarkAsSpamDetailVisible(filter, currentUserRole) {
            var isTrueForFilter = filter === FILTERS.UNASSIGNED || filter === FILTERS.USER
            || filter === FILTERS.SHARED || filter === FILTERS.OPEN;
            var isTrueForUser = currentUserRole == USER_ROLES.ADMIN;
            return (isTrueForFilter && isTrueForUser) || (currentUserRole == USER_ROLES.USER &&
                (filter === FILTERS.UNASSIGNED  ||  filter === FILTERS.USER));
        }

        function isAssignToUserVisible(filter, userRole) {
            var isTrueForFilter = filter === FILTERS.OPEN || filter === FILTERS.USER;
            var isTrueForShared = filter === FILTERS.SHARED && userRole !== USER_ROLES.USER;
            var isTrueForUnassigned = filter === FILTERS.UNASSIGNED && userRole !== USER_ROLES.USER;

            return isTrueForFilter || isTrueForShared || isTrueForUnassigned;
        }

        return {
            isLabelAsVisible : isLabelAsVisible,
            isClaimTicketVisible : isClaimTicketVisible,

            isPriorityVisible : isPriorityVisible,
            isPriorityIconVisible : isPriorityIconVisible,
            isPriorityForDetailPageVisible : isPriorityForDetailPageVisible,

            isMoveToTrashVisible : isMoveToTrashVisible,
            isMoveToTrashIconVisible : isMoveToTrashIconVisible,
            isMoveToTrashDetailedVisible : isMoveToTrashDetailedVisible,
            isMoveToTrashForeverIconVisible : isMoveToTrashForeverIconVisible,


            isRestoreForTrashVisible : isRestoreForTrashVisible,
            isRestoreForSpamVisible : isRestoreForSpamVisible,

            isChangeStatusVisible : isChangeStatusVisible,
            isMarkAsSpamIconVisible : isMarkAsSpamIconVisible,
            isMarkAsSpamDetailVisible : isMarkAsSpamDetailVisible,
            isAssignToUserVisible : isAssignToUserVisible,
            isMoreActionsMenuVisible : isMoreActionsMenuVisible,
            isDeleteSpamForAdminVisible : isDeleteSpamForAdminVisible
        }

    });

})(window, jQuery);
