APP.controller('RegistrationController', ['$scope', '$stateParams','$state', '$http', '$filter', '$sportService',
    function($scope, $stateParams, $state, $http, $filter, $sportService) {

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

    $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("image", files[0]);

        $http.post("http://localhost:8094/rocky-marciano" + '/clients' + '/image', fd, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function (success) {
            console.log(success);
        }, function (error) {
            console.log(error);
        })

    };

    $scope.sports = $sportService.sports;

    }]);