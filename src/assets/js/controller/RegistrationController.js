APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService',
    function($scope, $stateParams, $state, $http, $filter, ProductService) {

    $scope.save = function (client) {
        client.dateOfBirth = $filter('date')(client.dateOfBirth, 'yyyy-MM-dd');
        $http.post("http://localhost:8094/rocky-marciano" + '/clients', client).then(function (success) {
            $state.go('clientsList');
        }, function (error) {
            console.log('error: ', error);
        })

    }

    $scope.isValid = function(field) {
        return field != undefined && field != '';
    }

    $scope.sports = ProductService.sports;

    }]);