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

        $scope.updateClient = function (client) {
            $scope.edit(client);
            ClientService.save(client);
        };

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
        };

        $scope.edit = function (client) {
            client.isEditing = !client.isEditing;
            $scope.isEditingDisabled = !$scope.isEditingDisabled;
        };

        $scope.addClient = function () {
            UIkit.modal('#registration-modal').show();
        }

    }]);
