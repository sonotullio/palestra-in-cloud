APP.service('$columnService', [ function () {

    var self = this;

    self.sortColumn = function ($scope, col) {
        $scope.column = col;
        $scope.reverse = !$scope.reverse;
    };

}]);


