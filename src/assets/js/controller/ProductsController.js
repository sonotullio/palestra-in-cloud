APP.controller('ProductsController', ['$scope', '$stateParams', '$state', '$http', 'ProductService',
    function($scope, $stateParams, $state, $http, ProductService) {

        ProductService.getAll().then(function (success) {
            $scope.sports = success.data;
        });

        $scope.addProduct = function () {
            UIkit.modal('#registration-modal').show();
        }

        $scope.save = function (sport) {
            ProductService.save(sport);
            $state.reload();
        }

        $scope.delete = function (sport) {
            ProductService.delete(sport);
            ProductService.getAll().then(function (success) {
                $scope.sports = success.data;
            });
        }

    }]);