APP.controller('ClientDeleteController', ['$scope', '$rootScope', '$state', '$stateParams', 'ClientService',
    function ($scope, $rootScope, $state, $stateParams, ClientService) {

        $scope.delete = function (client) {
            ClientService.delete(client).then(function (deleteSuccess) {
                $state.go('clientList');
            })
        }

        $scope.back = function (client) {
            $state.go('clientList');
        }

    }]);
