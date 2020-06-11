APP.controller('PurchasesController', ['$scope', '$rootScope', '$stateParams', '$state', '$filter', 'ColumnService', 'PurchaseService',
    function($scope, $rootScope, $stateParams, $state, $filter, ColumnService, PurchaseService) {

        $scope.column = 'date';
        $scope.total = 0;

        PurchaseService.getAll().then(function (successCallback) {
            $scope.purchases = successCallback.data;

            $scope.purchases.forEach(function (item) {
                $scope.total += item.product.price;
            });
        });

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
        };

        $scope.fixTimeZoneOffset = function (date) {
            var retval = date;
            retval.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return retval;
        }

        $scope.find = function (from, to) {
            if (from && to) {
                PurchaseService.getAllBetween($filter('date')($scope.fixTimeZoneOffset(from), 'yyyy-MM-dd'), $filter('date')($scope.fixTimeZoneOffset(to), 'yyyy-MM-dd')).then(function (successCallback) {
                    $scope.purchases = successCallback.data;
                    $scope.total = 0;
                    $scope.purchases.forEach(function (item) {
                        $scope.total += item.product.price;
                    });
                }, function (error) {
                    alert(error.data.message);
                })
            } else {
                alert('Inserire sia la data di inizio, sia quella di fine.');
            }
        }

    }]);
