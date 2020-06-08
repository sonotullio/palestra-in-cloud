APP.controller('ClientsListController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ClientService', 'ColumnService',
    function($scope, $rootScope, $stateParams, $state, $http, ClientService, ColumnService) {

        $scope.column = 'id';

        ClientService.getAll().then(function (success) {
            $scope.clients = success.data;
            $scope.clients.forEach(function (client) {
                ClientService.setStatus(client, $rootScope.date);
            })
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.save = function (client) {
            client.isEditing = false;
            ClientService.save(client).then(function (clientSuccess) {
            })
        };

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
        };

        $scope.addClient = function () {
            UIkit.modal('#registration-modal').show();
        }

    }]);
