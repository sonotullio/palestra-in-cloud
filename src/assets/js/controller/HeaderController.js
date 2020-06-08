APP.controller('HeaderController', ['$scope', '$rootScope', '$stateParams', '$state', 'UserService',
    function($scope, $rootScope, $stateParams, $state, UserService) {

        $scope.click = function (section) {
            $scope.active = section;
        }

        $scope.isActive = function (section) {
            return $scope.active == section;
        }

        $scope.openClientCard = function (id) {
            $state.go('client', {id:id}, {reload: true})
        }

        $scope.registrati = function(cf, pwd) {
            UserService.save({cf: cf, password: pwd, admin: false}).then(function (success) {
                $rootScope.user = success.data;
                $scope.user = $rootScope.user
            }, function (error) {
                alert(error.data.message);
            })
        }

        $scope.accedi = function(cf, pwd) {
            UserService.login(cf, pwd).then(function (success) {
                $rootScope.user = success.data;
                $scope.user = $rootScope.user;
                $state.go('coursesPrenotation', {user: success.data});
            }, function (error) {
                alert(error.data.message);
            })
        }

        $scope.esci = function() {
            $rootScope.user = null;
            $scope.user = null;
            $state.go('home');
        }

        $rootScope.date = new Date();
        $scope.date = $rootScope.date;

    }]);
