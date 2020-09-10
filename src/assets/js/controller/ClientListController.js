APP.controller('ClientsListController', ['$scope', '$rootScope', 'ClientService', 'ColumnService',
    function($scope, $rootScope, ClientService, ColumnService) {

        $scope.column = 'expirationDate';

        ClientService.getAll().then(function (success) {
            $scope.clients = success.data;
            $scope.clients.forEach(function (client) {
                ClientService.setStatus(client, $rootScope.date);
            });
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
        };

        $scope.addClient = function () {
            UIkit.modal('#client-registration').show();
        }

    }]);
