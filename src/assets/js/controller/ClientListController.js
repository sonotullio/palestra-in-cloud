APP.controller('ClientsListController', ['$scope', 'ClientService', 'ColumnService',
    function($scope, ClientService, ColumnService) {

        $scope.column = 'name';

        ClientService.getAll().then(function (success) {
            $scope.clients = success.data;
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
