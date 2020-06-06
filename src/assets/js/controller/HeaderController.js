APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state',
    function($scope, $rootScope, $stateParams, $state, ) {

        $scope.click = function (section) {
            $scope.active = section;
        }

        $scope.isActive = function (section) {
            return $scope.active == section;
        }

        $scope.openClientCard = function (id) {
            $state.go('client', {id:id}, {reload: true})
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

    }]);