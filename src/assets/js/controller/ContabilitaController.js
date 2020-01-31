APP.controller('ContabilitaController', ['$scope', '$rootScope', '$stateParams', '$state', '$http',
    function($scope, $rootScope, $stateParams, $state, $http) {

        $http.get("http://localhost:8094/rocky-marciano" + '/contabilita').then(function (success) {
            $scope.cashflows = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

    }]);