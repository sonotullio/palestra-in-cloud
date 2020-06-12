APP.controller('ClientDeleteController', ['$scope', '$rootScope', '$state', '$stateParams', 'ClientService',
    function ($scope, $rootScope, $state, $stateParams, ClientService) {

        $scope.delete = function (client) {
            if ($scope.purchasesCount > 0) {
                alert(client.name + ' ' + client.surname + ' ha acquistato ' + $scope.purchasesCount + ' prodotti. Non è possibile rimuoverlo!')
            } else {
                ClientService.delete(client).then(function (deleteSuccess) {
                    UIkit.modal('#client-delete').hide();
                    $state.go('clientsList');
                }, function (error) {
                    alert(error.data.message);
                })
            }
        }

    }]);
