APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService', 'ClientService',
    function($scope, $stateParams, $state, $http, $filter, ProductService, ClientService) {

    $scope.save = function (client) {
        client.dateOfBirth = $filter('date')(client.dateOfBirth, 'yyyy-MM-dd');
        ClientService.registration(client).then(function (success) {
            $state.go('coursesPrenotation');
        }, function (error) {
            if (error.data.errors) {
                alert(error.data.errors[0].defaultMessage);
            } else {
                alert(error.data.message);
            }
        })

    }

    $scope.isValid = function(field) {
        return field != undefined && field != '';
    }

    $scope.sports = ProductService.sports;

    }]);
