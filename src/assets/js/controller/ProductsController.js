APP.controller('ProductsController', ['$scope', '$stateParams', '$state', '$http', 'ProductService', 'PurchaseService',
    function ($scope, $stateParams, $state, $http, ProductService, PurchaseService) {

        $scope.types = [
            {value: 'sport', label: 'Abbonamento'},
            {value: 'merchandise', label: 'Merchandise'}
        ];

        $scope.durations = [
            {value: 1, label: 'Mensile', multiplier: 1},
            {value: 6, label: 'Semestrale', multiplier: 5/6},
            {value: 12, label: 'Annuale', multiplier: 9/12},
        ];

        ProductService.getAll().then(function (success) {
            $scope.products = success.data;
            $scope.products.forEach(function (product) {
                PurchaseService.getByProductId(product.id).then(function (successCallback) {
                    product.purchases = successCallback.data;
                })
            })
        });

        $scope.addProduct = function () {
            UIkit.modal('#addEditProduct').show();
        };

        $scope.addProduct = function (product) {
            console.log(product);
            $scope.editProduct = {};
            Object.assign($scope.editProduct, product);
            UIkit.modal('#addEditProduct').show();
        };

        $scope.save = function (product) {
            ProductService.save(product);
            $state.reload();
        };

        $scope.delete = function (product) {
            ProductService.delete(product);
            $state.reload();
        };

        $scope.hasPurchases = function (product) {
            return product && product.purchases && product.purchases.length > 0;
        }

    }]);