APP.controller('SpesaController', ['$scope', '$stateParams','$state', '$http', '$filter',
    function($scope, $stateParams, $state, $http, $filter) {

    $scope.transaction = {};

    $scope.save = function (spesa) {
        $http.post("http://localhost:8094/rocky-marciano" + '/transactions', spesa).then(function (success) {
            $state.go('contabilita');
        }, function (error) {
            console.log('error: ', error);
        })

    }

    }]);