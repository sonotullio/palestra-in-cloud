APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService', 'ClientService',
    function($scope, $stateParams, $state, $http, $filter, ProductService, ClientService) {

    $scope.save = function (client) {
        client.dateOfBirth = $filter('date')(client.dateOfBirth, 'yyyy-MM-dd');
        ClientService.save(client).then(function (success) {
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
