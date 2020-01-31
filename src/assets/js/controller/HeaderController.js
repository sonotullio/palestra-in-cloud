APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state',
    function($scope, $rootScope, $stateParams, $state, ) {

        console.log('Header Controller');

        $scope.click = function (section) {
            $scope.active = section;
        }

        $scope.isActive = function (section) {
            return $scope.active == section;
        }

        $scope.openClientCard = function (id) {
            $state.go('client', {id:id})
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

        $scope.$watch('search', function (newValue, oldValue) {

        }, true);

    }]);