APP.controller('AddEditProductController', ['$scope', '$stateParams','$state', '$http', '$filter', 'ProductService',
    function($scope, $stateParams, $state, $http, $filter, ProductService) {

    $scope.types = [
        {value: 'Abbonamento', label: 'Abbonamento'},
        {value: 'Merchandise', label: 'Merchandise'}
    ];

    $scope.durations = [
        {value: 1, label: 'Mensile'},
        {value: 6, label: 'Semestrale'},
        {value: 12, label: 'Annuale'},
    ];

    $scope.sports = ProductService.sports;

    $scope.save = function (product) {
        console.log(product);
        $state.go('products');
    }

    }]);