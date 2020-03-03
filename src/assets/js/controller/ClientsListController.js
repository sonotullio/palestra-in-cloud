APP.controller('ClientsListController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$clientService', '$columnService',
    function($scope, $rootScope, $stateParams, $state, $http, $clientService, $columnService) {

        $http.get("http://localhost:8094/rocky-marciano" + '/clients').then(function (success) {
            $scope.clients = success.data;
            $scope.clients.forEach(function (client) {
                $clientService.setStatus(client, $rootScope.date);
            })
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.search = $rootScope.search;

        $scope.updateClient = function (client) {
            $scope.edit(client);
            $clientService.save(client);
        };

        $scope.sortColumn = function (col) {
            $columnService.sortColumn($scope, col);
        };

        $scope.edit = function (client) {
            client.isEditing = !client.isEditing;
            $scope.isEditingDisabled = !$scope.isEditingDisabled;
        };

        $scope.addClient = function () {
            UIkit.modal('#registration-modal').show();
        }

    }]);