APP.controller('StatisticsController', ['$scope', '$stateParams', '$state', 'ColumnService', 'PurchaseService', 'EntranceService', 'ChartService',
    function($scope, $stateParams, $state, ColumnService, PurchaseService, EntranceService, ChartService) {

        $scope.purchaseCtx = $('#purchases');
        $scope.purchasesChart = new Chart($scope.purchaseCtx, ChartService.default());

        $scope.entrancesCtx = $('#entrances');
        $scope.entrancesChart = new Chart($scope.entrancesCtx, ChartService.default());

        PurchaseService.getAllMappedByProduct().then(function (successCallback) {
            $scope.purchases = successCallback.data;

            $scope.purchases.forEach(function (purchase) {
                $scope.purchasesChart.data.labels.push(purchase.label)
                $scope.purchasesChart.data.datasets[0].data.push(purchase.value);
            });

            $scope.purchasesChart.update();
        });

        EntranceService.getAllMappedByProduct().then(function (successCallback) {
            $scope.entrances = successCallback.data;

            $scope.entrances.forEach(function (entrance) {
                $scope.entrancesChart.data.labels.push(entrance.label)
                $scope.entrancesChart.data.datasets[0].data.push(entrance.value);
            });

            $scope.entrancesChart.update();
        });

    }]);