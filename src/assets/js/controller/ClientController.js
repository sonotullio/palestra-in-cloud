APP.controller('ClientController', ['$scope', '$stateParams', '$state', '$http', '$sportService',
    function($scope, $stateParams, $state, $http, $sportService) {

        $scope.clientId = $stateParams.id;

        $http.get("http://localhost:8094/rocky-marciano" + '/clients/' + $scope.clientId).then(function (success) {
            $scope.client = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.sports = $sportService.sports;

        $scope.subscription = function (client) {
            $state.go('subscription', {id: client.id});
        };

    }]);