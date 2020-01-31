APP.controller('ContabilitaController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', '$columnService',
    function($scope, $rootScope, $stateParams, $state, $http, $columnService) {

        $http.get("http://localhost:8094/rocky-marciano" + '/contabilita').then(function (success) {
            $scope.cashflows = success.data;
        }, function (error) {
            console.log('error: ', error);
        });

        $scope.sortColumn = function (col) {
            $columnService.sortColumn($scope, col);
        };

    }]);