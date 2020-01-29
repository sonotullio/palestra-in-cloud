APP.controller('AttivitaController', ['$scope', '$stateParams', '$state', '$http', '$sportService',
    function($scope, $stateParams, $state, $http, $sportService) {

        $sportService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.add = function () {
            $scope.sports.push({name: "", price: 0, isEditing: true});
        }

        $scope.save = function (sport) {
            $sportService.save(sport);
        }

        $scope.delete = function (sport) {
            $sportService.delete(sport);
            $sportService.getAll().then(function (success) {
                $scope.sports = success.data;
            });
        }

    }]);