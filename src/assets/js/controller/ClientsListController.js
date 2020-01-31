APP.controller('ClientsListController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$clientService', '$columnService',
    function($scope, $rootScope, $stateParams, $state, $http, $clientService, $columnService) {

        $http.get("http://localhost:8094/rocky-marciano" + '/clients').then(function (success) {
            $scope.clients = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.search = $rootScope.search;

        $scope.isExpired = function (client) {
            return client.expirationDate == undefined || client.expirationDate < $rootScope.date || client.certificateExpirationDate == undefined || client.certificateExpirationDate < $rootScope.date
        }

        $scope.isAlert = function (client) {
            var date = new Date($rootScope.date);
            date = date.setDate(date.getDate() + 7);
            date = new Date(date);
            return new Date(client.expirationDate) < date || new Date(client.certificateExpirationDate) < date;
        }

        $scope.updateClient = function (client) {
            client.isEditing = false;
            $clientService.save(client);
        }

        $scope.sortColumn = function (col) {
            $columnService.sortColumn($scope, col);
        }
    }]);