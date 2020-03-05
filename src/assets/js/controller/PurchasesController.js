APP.controller('PurchasesController', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ColumnService', 'PurchaseService',
    function($scope, $rootScope, $stateParams, $state, $http, ColumnService, PurchaseService) {

        $scope.column = 'date';

        PurchaseService.getAll().then(function (successCallback) {
            $scope.purchases = successCallback.data;
        });

        $scope.sortColumn = function (col) {
            ColumnService.sortColumn($scope, col);
        };

    }]);