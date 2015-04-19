describe('FilesService', function () {

    window.$injector = angular.injector(['ng', 'main.services']);
        window.$rootScope = $injector.get('$rootScope');
        window.TicketsService = $injector.get('TicketsService');
        window.Utils = $injector.get('Utils');
        //window.FilesService = $injector.get('FilesService');
        //window.FilesService = $injector.get('FilesService');

});