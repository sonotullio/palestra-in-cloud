APP.controller('HomepageController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state, ) {

        $scope.addAccount = function () {
            $state.go('addAccount');
        }


    }]);